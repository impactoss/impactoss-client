/* eslint-disable no-restricted-syntax */
/**
 * This script will extract the internationalization messages from all components
 * and package them in the translation json files in the translations file.
 */

require('shelljs/global');

const fs = require('fs');
const nodeGlob = require('glob');
const { transform } = require('@babel/core');
const get = require('lodash/get');

const animateProgress = require('./helpers/progress');
const addCheckmark = require('./helpers/checkmark');

const { appLocales, DEFAULT_LOCALE } = require('../../app/i18n');

const babel = require('../../babel.config.js');
const { presets } = babel;
let plugins = babel.plugins || [];

plugins.push('react-intl');

// NOTE: styled-components plugin is filtered out as it creates errors when used with transform
plugins = plugins.filter(p => p !== 'styled-components');

// Glob to match all js files except test files
const FILES_TO_PARSE = 'app/**/!(*.test).js';

const newLine = () => process.stdout.write('\n');

// Progress Logger
let progress;
const task = message => {
  progress = animateProgress(message);
  process.stdout.write(message);

  return error => {
    if (error) {
      process.stderr.write(error);
    }
    clearTimeout(progress);
    return addCheckmark(() => newLine());
  };
};

// Wrap async functions below into a promise
const glob = pattern =>
  new Promise((resolve, reject) => {
    nodeGlob(
      pattern,
      (error, value) => (error ? reject(error) : resolve(value)),
    );
  });

const readFile = fileName =>
  new Promise((resolve, reject) => {
    fs.readFile(
      fileName,
      'utf8',
      (error, value) => (error ? reject(error) : resolve(value)),
    );
  });

// Store existing translations into memory
const oldLocaleMappings = [];
const localeMappings = [];

// Loop to run once per locale
for (const locale of appLocales) {
  oldLocaleMappings[locale] = {};
  localeMappings[locale] = {};
  // File to store translation messages into
  const translationFileName = `app/translations/${locale}.json`;
  try {
    // Parse the old translation message JSON files
    const messages = JSON.parse(fs.readFileSync(translationFileName));
    const messageKeys = Object.keys(messages);
    for (const messageKey of messageKeys) {
      oldLocaleMappings[locale][messageKey] = messages[messageKey];
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      process.stderr.write(
        `There was an error loading this translation file: ${translationFileName}
        \n${error}`,
      );
    }
  }
}
//convert the js-like object string to valid JSON
function convertToJSON(str) {
  const removeNewLineRegex = /\n/g;
  const trailingCommaRegex = /,(\s*})/g;
  const wordKeysRegex = /(?<=[,{])\s*(\w+)\s*(?=:)/g;
  const escapedCharsRegex = /\\/g;
  const numberKeysRegex = /(\b\d+\b):/g;
  const valuesSurroundedInQuotes = /'((?:\\'|[^'])*)'/g;

  return str
    .replace(removeNewLineRegex, '')
    .replace(trailingCommaRegex, '$1')
    .replace(valuesSurroundedInQuotes, (_, value) => {
      //  Wrap the value with double quotes and replace double quotes inside with single quotes 
      return `"${value.replace(/"/g, "'")}"`;
    })
    .replace(wordKeysRegex, '"$1"')
    .replace(numberKeysRegex, '"$1":')
    .replace(escapedCharsRegex, '');
}

function flattenContents(data, filename) {
  //check to see if file contains defineMessage 
  const defineMessageMatch = data.match(/export\s+default\s+defineMessages\(({[\s\S]*?})\);/);

  if (defineMessageMatch && defineMessageMatch.length > 1) {
    const defineMessageContents = defineMessageMatch[1];
    const jsonString = convertToJSON(defineMessageContents, filename);
    const parsedJSON = JSON.parse(jsonString);

    const flattenedDefineMessage = {};

    //check if last level of object
    const isLastLevel = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          return false;
        }
      }
      return true;
    };

    //flatten the defineMessage object so there are no nested objects
    const flatten = (obj, prefix = '') => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (isLastLevel(obj[key])) {
            flattenedDefineMessage[`${prefix}${key}`] = obj[key];
          } else {
            flatten(obj[key], `${prefix}${key}.`);
          }
        } else {
          flattenedDefineMessage[`${prefix}${key}`] = obj[key];
        }
      }
    };
    //flatten object to 1 level
    flatten(parsedJSON);
    //convert the flattened object back to a string
    const flattenedDefineMessageString = JSON.stringify(flattenedDefineMessage, null, 2);
    //add contents it back into the file data 
    return data.replace(/defineMessages\(\s*\{[^]*?}\s*\);/, `defineMessages(${flattenedDefineMessageString})`);
  }

  return data;
}
const extractFromFile = async filename => {
  try {
    const code = await readFile(filename);
    const parsedCode = flattenContents(code, filename);

    const output = await transform(parsedCode, { filename, presets, plugins });
    const messages = get(output, 'metadata.react-intl.messages', []);

    for (const message of messages) {
      for (const locale of appLocales) {
        const oldLocaleMapping = oldLocaleMappings[locale][message.id];
        // Merge old translations into the babel extracted instances where react-intl is used
        const newMsg = locale === DEFAULT_LOCALE ? message.defaultMessage : '';
        localeMappings[locale][message.id] = oldLocaleMapping || newMsg;
      }
    }
  } catch (error) {
    process.stderr.write(`\nError transforming file: ${filename}\n${error}\n`);
  }
};

const memoryTask = glob(FILES_TO_PARSE);
const memoryTaskDone = task('Storing language files in memory');

memoryTask.then(files => {
  memoryTaskDone();

  const extractTask = Promise.all(
    files.map(fileName => extractFromFile(fileName)),
  );
  const extractTaskDone = task('Run extraction on all files');
  // Run extraction on all files that match the glob on line 16
  extractTask.then(() => {
    extractTaskDone();

    // Make the directory if it doesn't exist, especially for first run
    mkdir('-p', 'app/translations'); // eslint-disable-line

    let localeTaskDone;
    let translationFileName;

    for (const locale of appLocales) {
      translationFileName = `app/translations/${locale}.json`;
      localeTaskDone = task(
        `Writing translation messages for ${locale} to: ${translationFileName}`,
      );

      // Sort the translation JSON file so that git diffing is easier
      // Otherwise the translation messages will jump around every time we extract
      const messages = {};
      Object.keys(localeMappings[locale])
        .sort()
        .forEach(key => {
          messages[key] = localeMappings[locale][key];
        });

      // Write to file the JSON representation of the translation messages
      const prettified = `${JSON.stringify(messages, null, 2)}\n`;

      try {
        fs.writeFileSync(translationFileName, prettified);
        localeTaskDone();
      } catch (error) {
        localeTaskDone(
          `There was an error saving this translation file: ${translationFileName}
          \n${error}`,
        );
      }
    }

    process.exit();
  });
});

import { toLower as loCase } from 'lodash/string';
import { reduce } from 'lodash/collection';
import { TEXT_TRUNCATE } from 'themes/config';

export const lowerCase = (str) => loCase(str)
  .replace('\bun\b', 'UN')
  .replace('\bhr\b', 'HR')
  .replace('\bupr\b', 'UPR')
  .replace('sdg', 'SDG')
  .replace('sds', 'SDS')
  .replace('\bsmart\b', 'SMART')
  .replace('sustainable development goal', 'Sustainable Development Goal');

export const getPathFromUrl = (url) => url.split(/[?#]/)[0];

export const getFilenameFromUrl = (url) => url.split('/').pop();

export const cleanupSearchTarget = (str) => loCase(str)
  .replace(/[’]/, '\'')
  .replace(/[ā]/, 'a')
  .replace(/[ē]/, 'e')
  .replace(/[ī]/, 'i')
  .replace(/[ō]/, 'o')
  .replace(/[ū]/, 'u');

// adapted from
// https://stackoverflow.com/questions/19793221/javascript-text-between-double-quotes
const extractAllPhrases = (str) => {
  const re = /"(.*?)"/g;
  const phrases = [];
  let current;
  /* eslint-disable no-cond-assign */
  while (current = re.exec(str)) {
    phrases.push(current.pop());
  }
  /* eslint-enable no-cond-assign */
  return phrases;
};

// match multiple words, incl substrings
// also check for exact phrases in "quotes"
export const regExMultipleWords = (str) => {
  // first extract phrases and turn to words
  const phrases = extractAllPhrases(str);
  const phraseWords = phrases.length > 0
    ? reduce(
      phrases,
      (memo, p) => `${memo}(?=.*${p})`,
      '',
    )
    : '';
  // then remove phrases from original string
  // and turn to words
  const strWithoutPhrases = reduce(
    phrases,
    (memo, p) => str.replace(`"${p}"`, ''),
    str,
  );
  const words = reduce(
    strWithoutPhrases
      .replace('"', '')
      .split(' '),
    (memo, s) => s !== ''
      ? `${memo}(?=.*${s})`
      : memo,
    '',
  );
  // finally combine
  return `${phraseWords}${words}`;
};

// match multiple words
export const regExMultipleWordsMatchStart = (str) => reduce(str.split(' '), (words, s) => `${words}(?=.*\\b${s})`, '');

export const truncateText = (text, limit, keepWords = true) => {
  if (text.length > (limit + TEXT_TRUNCATE.GRACE)) {
    if (!keepWords) {
      return `${text.substring(0, limit).trim()}\u2026`;
    }
    const words = text.split(' ');
    let truncated = '';
    while (truncated.length <= limit) {
      const word = words.shift();
      truncated = truncated.length > 0 ? `${truncated} ${word}` : word;
    }
    // check if really truncated (not a given as we accept full words)
    return text.length > truncated.length ? `${truncated}\u2026` : text;
  }
  return text;
};

export const startsWith = (str, searchString) => str.substr(0, searchString.length) === searchString;

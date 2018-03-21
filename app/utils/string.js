import { toLower as loCase } from 'lodash/string';
import { reduce } from 'lodash/collection';

export const lowerCase = (str) =>
  loCase(str).replace('un', 'UN').replace('hr', 'HR').replace('upr', 'UPR').replace('sdg', 'SDG').replace('smart', 'SMART');

export const getPathFromUrl = (url) => url.split(/[?#]/)[0];

export const getFilenameFromUrl = (url) => url.split('/').pop();

export const cleanupSearchTarget = (str) =>
  loCase(str)
    .replace(/[’]/, '\'')
    .replace(/[ā]/, 'a')
    .replace(/[ē]/, 'e')
    .replace(/[ī]/, 'i')
    .replace(/[ō]/, 'o')
    .replace(/[ū]/, 'u');

// match multiple words, incl substrings
export const regExMultipleWords = (str) =>
  reduce(str.split(' '), (words, s) => `${words}(?=.*${s})`, '');

// match multiple words
export const regExMultipleWordsMatchStart = (str) =>
  reduce(str.split(' '), (words, s) => `${words}(?=.*\\b${s})`, '');

export const truncateText = (text, limit, keepWords = true) => {
  if (text.length > limit) {
    if (!keepWords) {
      return `${text.substring(0, limit)}\u2026`;
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

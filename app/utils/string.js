import { lowerCase as loCase } from 'lodash/string';
import { reduce } from 'lodash/collection';

export const lowerCase = (str) =>
  loCase(str).replace('un', 'UN').replace('hr', 'HR').replace('upr', 'UPR');

export const getPathFromUrl = (url) => url.split(/[?#]/)[0];

export const getFilenameFromUrl = (url) => url.split('/').pop();

export const cleanupSearchTarget = (str) =>
  loCase(str)
    .replace(/[ā]/, 'a')
    .replace(/[ē]/, 'e')
    .replace(/[ī]/, 'i')
    .replace(/[ō]/, 'o')
    .replace(/[ū]/, 'u');

    // match multiple words
    // see http://stackoverflow.com/questions/5421952/how-to-match-multiple-words-in-regex
export const regExMultipleWords = (str) =>
  reduce(str.split(' '), (words, s) => `${words}(?=.*\\b${s})`, '');

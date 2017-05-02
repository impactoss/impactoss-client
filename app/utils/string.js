import { lowerCase as lcase } from 'lodash/string';

export const lowerCase = (str) =>
  lcase(str).replace('un', 'UN').replace('hr', 'HR').replace('upr', 'UPR');

export const getPathFromUrl = (url) => url.split(/[?#]/)[0];

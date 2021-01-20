import isValid from 'date-fns/isValid';
// import { DB_DATE_FORMAT } from 'themes/config';

// validating the required db format, fails if entered locale format cannot be parsed to required format
export default function validateDateFormat(val) {
  // , DB_DATE_FORMAT, true).isValid();
  // TODO validate date format
  return !val || val === '' || isValid(val);
}

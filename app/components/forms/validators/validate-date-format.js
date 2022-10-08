import { isValid, parseISO, parse } from 'date-fns';

import { API_DATE_FORMAT } from 'themes/config';

// validating the required db format, fails if entered locale format cannot be parsed to required format
export default function validateDateFormat(val, dateFormat) {
  // allow empty values
  if (!val || val === '') return true;
  // validate date format
  // parse custom
  if (dateFormat) {
    return val.length === dateFormat.length && isValid(
      parse(val, dateFormat, new Date())
    );
  }
  // parse ISO
  return val.length >= API_DATE_FORMAT.length && isValid(parseISO(val));
}

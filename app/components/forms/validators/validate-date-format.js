import { isValid, parse } from 'date-fns';

import { DB_DATE_FORMAT } from 'themes/config';

// validating the required db format, fails if entered locale format cannot be parsed to required format
export default function validateDateFormat(val, dateFormat = DB_DATE_FORMAT) {
  // validate date format
  return !val
    || val === ''
    || (
      val.length === dateFormat.length
      && isValid(
        parse(
          val,
          dateFormat,
          new Date(),
        )
      )
    );
}

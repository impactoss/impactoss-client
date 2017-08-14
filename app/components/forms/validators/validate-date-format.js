import moment from 'moment';
import { DB_DATE_FORMAT } from 'containers/App/constants';

// validating the required db format, fails if entered locale format cannot be parsed to required format
export default function validateDateFormat(val) {
  return !val || val === '' || moment(val, DB_DATE_FORMAT, true).isValid();
}

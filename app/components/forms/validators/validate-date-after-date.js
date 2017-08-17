import validateDateFormat from './validate-date-format';
export default function validateDateAfterDate(dateAfter, dateBefore) {
  return validateDateFormat(dateAfter) && validateDateFormat(dateBefore) ? new Date(dateAfter) > new Date(dateBefore) : true;
}

import isInteger from 'utils/is-integer';
export default function validateNumber(val) {
  return val === null || val === '' || isInteger(val);
}

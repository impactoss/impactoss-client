export default function validateMinLength(val, minLength) {
  return val && val !== '' && val.toString().length >= minLength;
}

export default function validateLength(val, minLength) {
  return !val || val === '' || val.toString().length >= minLength;
}

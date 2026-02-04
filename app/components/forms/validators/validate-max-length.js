export default function validateMaxLength(val, maxLength) {
  return !val || val === '' || val.toString().length <= maxLength;
}

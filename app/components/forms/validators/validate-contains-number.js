export default function validateContainsNumber(val) {
  return val !== null && val && /\d/.test(val);
}

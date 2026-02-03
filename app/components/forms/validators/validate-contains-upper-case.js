export default function validateContainsUpperCase(val) {
  return val !== null && val && /[A-Z]/.test(val);
}

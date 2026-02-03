export default function validateContainsLowerCase(val) {
  return val !== null && val && /[a-z]/.test(val);
}

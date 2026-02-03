export default function validateContainsSpecialCharacter(val) {
  return val !== null && val && /[^A-Za-z0-9]/.test(val);
}

export default function validateRequired(val) {
  return (val !== null && val) ? val.length > 0 : false;
}

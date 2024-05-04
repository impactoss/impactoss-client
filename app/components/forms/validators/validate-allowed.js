export default function validateAllowed(val, prohibitedValues) {
  return prohibitedValues.indexOf(val.trim()) === -1;
}

export default function isInteger(test) {
  /* eslint-disable no-restricted-globals */
  return !isNaN(test) && !isNaN(parseInt(test, 10)) && parseInt(test, 10).toString() === test.toString();
}

export default function isInteger(test) {
  return !isNaN(test) && !isNaN(parseInt(test, 10)) && parseInt(test, 10).toString() === test.toString();
}

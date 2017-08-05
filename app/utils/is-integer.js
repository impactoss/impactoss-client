export default function isInteger(test) {
  return !isNaN(test) && parseInt(Number(test), 10) === test && !isNaN(parseInt(test, 10));
}

export default function isNumber(test) {
  return !isNaN(parseFloat(test)) && isFinite(test);
}

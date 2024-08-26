export default function validateMatch(valueA, valueB) {
  return !valueA || valueA === '' || !valueB || valueB === '' || valueA === valueB;
}

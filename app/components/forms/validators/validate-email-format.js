// very basic email validation
export default function validateEmailFormat(val) {
  const re = /\S+@\S+\.\S+/;
  return !val || val === '' || re.test(val);
}

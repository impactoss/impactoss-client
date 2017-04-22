//
export const optionChecked = (queryValue, value) =>
  !!(queryValue && Array.isArray(queryValue) ? queryValue : [queryValue].indexOf(value.toString()) > -1);
// attribute checked
export const attributeOptionChecked = (queryValue, value) => !!(queryValue && queryValue.substr(0, value.length) === value.toString());

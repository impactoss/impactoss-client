import asList from 'utils/as-list';

//
export const optionChecked = (queryValue, value) =>
  !!(queryValue && (asList(queryValue)).includes(value.toString()));

// attribute checked
export const attributeOptionChecked = (queryValue, value) =>
  !!(queryValue && queryValue.substr(0, value.length) === value.toString());

import asList from 'utils/as-list';
import { getEntityTitle, getEntityReference } from 'utils/entities';

//
export const optionChecked = (queryValue, value) =>
  !!(queryValue && (asList(queryValue)).includes(value.toString()));

// attribute checked
export const attributeOptionChecked = (queryValue, value) =>
  !!(queryValue && queryValue.substr(0, value.length) === value.toString());


export const getConnectionTitle = (connection) => getEntityTitle(connection);

export const getConnectionReference = (connection) => getEntityReference(connection);

export const getCategoryTitle = (category) => getEntityTitle(category);

export const getCategoryReference = (category) => getEntityReference(category, false);

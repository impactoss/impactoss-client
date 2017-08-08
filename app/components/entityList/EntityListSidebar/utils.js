import asList from 'utils/as-list';
import {
  getEntityTitle,
  getEntityReference,
  getCategoryShortTitle,
} from 'utils/entities';

//
export const optionChecked = (queryValue, value) =>
  !!(queryValue && (asList(queryValue)).includes(value.toString()));

// attribute checked
export const attributeOptionChecked = (queryValue, value) =>
  !!(queryValue && queryValue.substr(0, value.length) === value.toString());

// turn taxonomies into multiselect options
export const makeTagFilterGroups = (connections, connectedTaxonomies) =>
  connectedTaxonomies.map((taxonomy) => ({
    title: taxonomy.getIn(['attributes', 'title']),
    palette: ['taxonomies', parseInt(taxonomy.get('id'), 10)],
    options: taxonomy.get('categories').map((category) => ({
      reference: getEntityReference(category, false),
      label: getEntityTitle(category),
      filterLabel: getCategoryShortTitle(category),
      showCount: false,
      value: category.get('id'),
    })).toList().toArray(),
  })).toList().toArray();

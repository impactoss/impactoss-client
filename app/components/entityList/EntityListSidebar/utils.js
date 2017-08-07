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

export const makeTagFilterGroups = (connections, connectedTaxonomies) => {
  // get all actually connected categories from connections
  const connectionCategoryIds = connections
    .map((connection) => connection.get('categories'))
    .flatten()
    .toSet()
    .toList();

  // turn taxonomies into multiselect options if category available
  return connectionCategoryIds.size > 0
    && !(connectionCategoryIds.size === 1 && !connectionCategoryIds.first())
    ? connectedTaxonomies.reduce((memo, taxonomy) => {
      // console.log(taxonomy.get('categories').keySeq().toJS())
      const taxCategories = taxonomy.get('categories').filter((cat) => connectionCategoryIds.includes(parseInt(cat.get('id'), 10)));
      // console.log('taxCategories', taxCategories.size)
      return taxCategories.size > 0
        ? memo.concat([{
          title: taxonomy.getIn(['attributes', 'title']),
          options: taxCategories.map((category) => ({
            reference: getEntityReference(category, false),
            label: getEntityTitle(category),
            filterLabel: getCategoryShortTitle(category),
            showCount: false,
            value: category.get('id'),
          })).toList().toArray(),
        }])
        : memo;
    }, [])
    : [];
};

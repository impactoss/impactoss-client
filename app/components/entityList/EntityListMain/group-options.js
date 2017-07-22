import { List, Map } from 'immutable';

export const getGroupValue = (taxonomies, connectedTaxonomies, groupAttribute, level) => {
  if (groupAttribute && taxonomies) {
    const defaultTaxomony = taxonomies.find((tax) =>
      tax.getIn(['attributes', groupAttribute]) === level
    );
    if (defaultTaxomony) {
      return defaultTaxomony.get('id');
    }
  }
  if (groupAttribute && connectedTaxonomies) {
    const defaultCTaxomony = connectedTaxonomies.find((tax) =>
      tax.getIn(['attributes', groupAttribute]) === level
    );
    if (defaultCTaxomony) {
      return `x:${defaultCTaxomony.get('id')}`;
    }
  }
  return null;
};

// args: immutable Maps
export const getGroupOptions = (taxonomies, connectedTaxonomies) => {
  let options = List();

  // taxonomy options
  if (taxonomies) {
    // first prepare taxonomy options
    options = options.concat(
      taxonomies
      .map((taxonomy) => Map({
        value: taxonomy.get('id'), // filterOptionId
        label: taxonomy.getIn(['attributes', 'title']),
      }))
      .toList()
    );
  }

  // connectedTaxonomies options
  if (connectedTaxonomies) {
    // first prepare taxonomy options
    options = options.concat(
      connectedTaxonomies
        .map((taxonomy) => Map({
          value: `x:${taxonomy.get('id')}`, // filterOptionId
          label: taxonomy.getIn(['attributes', 'title']),
        }))
        .toList()
    );
  }
  return options;
};

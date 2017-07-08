import { List, Map } from 'immutable';

// args: immutable Maps
export const getGroupOptions = (taxonomies, connectedTaxonomies) => {
  let options = List();

  // taxonomy options
  if (taxonomies) {
    // first prepare taxonomy options
    options = options.merge(
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
    options = options.merge(
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

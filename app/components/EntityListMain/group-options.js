import { List, Map } from 'immutable';
import { sortEntities } from 'utils/sort';

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
      sortEntities(
        taxonomies.map((taxonomy) => Map({
          value: taxonomy.get('id'), // filterOptionId
          label: taxonomy.getIn(['attributes', 'title']),
          sortBy: taxonomy.getIn(['attributes', 'priority']),
        })),
        'asc',
        'sortBy'
      )
    );
  }

  // connectedTaxonomies options
  if (connectedTaxonomies) {
    // first prepare taxonomy options
    options = options.concat(
      sortEntities(
        connectedTaxonomies
        .filter((taxonomy) => !taxonomies || !taxonomies.map((tax) => tax.get('id')).includes(taxonomy.get('id')))
        .map((taxonomy) => Map({
          value: `x:${taxonomy.get('id')}`, // filterOptionId
          label: taxonomy.getIn(['attributes', 'title']),
          sortBy: taxonomy.getIn(['attributes', 'priority']),
        })),
        'asc',
        'sortBy'
      )
    );
  }
  return options;
};

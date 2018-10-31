import { List, Map } from 'immutable';
import { sortEntities } from 'utils/sort';
import appMessages from 'containers/App/messages';

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

const getTaxTitle = (id, contextIntl) => contextIntl ? contextIntl.formatMessage(appMessages.entities.taxonomies[id].single) : '';

// args: immutable Maps
export const getGroupOptions = (taxonomies, connectedTaxonomies, contextIntl) => {
  let options = List();

  // taxonomy options
  if (taxonomies) {
    // first prepare taxonomy options
    options = options.concat(
      sortEntities(
        taxonomies.map((taxonomy) => Map({
          value: taxonomy.get('id'), // filterOptionId
          label: getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl),
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
          label: getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl),
        })),
        'asc',
        'sortBy'
      )
    );
  }
  return options;
};

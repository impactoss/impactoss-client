import { Map, List } from 'immutable';
import { forEach } from 'lodash/collection';
import { toLower as loCase } from 'lodash/string';
import { lowerCase } from 'utils/string';
import {
  getConnectedCategories,
  testEntityCategoryAssociation,
} from 'utils/entities';
import isNumber from 'utils/is-number';
import { getEntitySortComparator } from 'utils/sort';

import appMessages from 'containers/App/messages';

export const groupEntities = (
  entities,
  taxonomies,
  connectedTaxonomies,
  config,
  groupSelectValue,
  subgroupSelectValue,
  messages,
  contextIntl
) => subgroupSelectValue
  ? makeEntityGroups(entities, taxonomies, connectedTaxonomies, config, groupSelectValue, messages, contextIntl)
    .map((group) => group
      .set(
        'entityGroups',
        makeEntityGroups(group.get('entities'), taxonomies, connectedTaxonomies, config, subgroupSelectValue, messages, contextIntl)
      )
      .delete('entities')
    )
  : makeEntityGroups(entities, taxonomies, connectedTaxonomies, config, groupSelectValue, messages, contextIntl);

const makeEntityGroups = (
  entities,
  taxonomies,
  connectedTaxonomies,
  config,
  groupSelectValue,
  messages,
  contextIntl
) => {
  if (groupSelectValue) {
    if (isNumber(groupSelectValue)) {
      const taxonomy = taxonomies.get(groupSelectValue);
      return makeTaxonomyGroups(entities, taxonomy, messages, contextIntl);
    }
    const locationQueryGroupSplit = groupSelectValue.split(':');
    if (locationQueryGroupSplit.length > 1) {
      const taxonomy = connectedTaxonomies.get(locationQueryGroupSplit[1]);
      if (taxonomy) {
        return makeConnectedTaxonomyGroups(entities, taxonomy, config, messages, contextIntl);
      }
    }
    return List().push(Map({ entities }));
  }
  return List().push(Map({ entities }));
};
const getCategoryLabel = (cat) =>
  cat.getIn(['attributes', 'reference'])
  ? `${cat.getIn(['attributes', 'reference'])} ${cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name'])}`
  : cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name']);

const getTaxTitle = (id, contextIntl) => contextIntl ? contextIntl.formatMessage(appMessages.entities.taxonomies[id].single) : '';

export const makeTaxonomyGroups = (entities, taxonomy, messages, contextIntl) => {
  let groups = Map();
  entities.forEach((entity) => {
    let hasTaxCategory = false;
    // if entity has taxonomies
    if (entity.get('categories')) {
      // add categories from entities if not present otherwise increase count
      taxonomy.get('categories').forEach((cat, catId) => {
        // if entity has category of active taxonomy
        if (testEntityCategoryAssociation(entity, catId)) {
          hasTaxCategory = true;
          // if category already added
          if (groups.get(catId)) {
            groups = groups.setIn([catId, 'entities'], groups.getIn([catId, 'entities']).push(entity));
          } else {
            const label = getCategoryLabel(cat);
            groups = groups.set(catId, Map({
              label,
              entities: List().push(entity),
              order: loCase(label),
              id: catId,
            }));
          }
        }
      });
    }
    if (!hasTaxCategory) {
      if (groups.get('without')) {
        groups = groups.setIn(['without', 'entities'], groups.getIn(['without', 'entities']).push(entity));
      } else {
        groups = groups.set('without', Map({
          label: `${messages.without} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`, // `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
          entities: List().push(entity),
          order: 'zzzzzzzz',
          id: 'without',
        }));
      }
    }
  });  // for each entities
  return groups.sortBy(
    (group) => group.get('order'),
    (a, b) => getEntitySortComparator(a, b, 'asc')
  ).toList();
};

export const setGroup = (entity, groupId) => entity.get('group')
  ? entity.set('group', List().push(entity.get('group')).push())
  : entity.set('group', groupId);

export const makeConnectedTaxonomyGroups = (entities, taxonomy, config, messages, contextIntl) => {
  let groups = Map();
  entities.forEach((entity) => {
    let hasTaxCategory = false;
    forEach(config.connectedTaxonomies.connections, (connection) => {
      // if entity has taxonomies
      if (entity.get(connection.path)) { // measure.recommendations stores recommendation_measures
        // add categories from entities if not present otherwise increase count
        const categories = getConnectedCategories(
          entity.get(connection.path),
          taxonomy.get('categories'),
          connection.path,
        );
        hasTaxCategory = hasTaxCategory || categories.size > 0;
        categories.forEach((cat, catId) => {
          // if category already added
          if (groups.get(catId)) {
            groups = groups.setIn([catId, 'entities'], groups.getIn([catId, 'entities']).push(entity));
          } else {
            const label = getCategoryLabel(cat);
            groups = groups.set(catId, Map({
              label,
              entities: List().push(entity),
              order: loCase(label),
              id: catId,
            }));
          }
        });
      }
    });  // for each connection
    if (!hasTaxCategory) {
      if (groups.get('without')) {
        groups = groups.setIn(['without', 'entities'], groups.getIn(['without', 'entities']).push(entity));
      } else {
        groups = groups.set('without', Map({
          label: `${messages.without} ${lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl))}`, // `${messages.without} ${lowerCase(taxonomy.attributes.title)}`,
          entities: List().push(entity),
          order: 'zzzzzzzzz',
          id: 'without',
        }));
      }
    }
  });  // for each entities
  return groups.sortBy(
    (group) => group.get('order'),
    (a, b) => getEntitySortComparator(a, b, 'asc')
  ).toList();
};

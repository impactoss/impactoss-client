import { Map, List } from 'immutable';
import { toLower as loCase } from 'lodash/string';
import { lowerCase } from 'utils/string';
import {
  testEntityCategoryAssociation,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import isNumber from 'utils/is-number';
import { getEntitySortComparator } from 'utils/sort';

import appMessages from 'containers/App/messages';
import messages from './messages';

export const groupEntities = (
  entities,
  taxonomies,
  connectedTaxonomies,
  config,
  groupSelectValue,
  subgroupSelectValue,
  contextIntl,
  frameworks,
) => subgroupSelectValue
  ? makeEntityGroups(
    entities,
    taxonomies,
    connectedTaxonomies,
    config,
    groupSelectValue,
    contextIntl,
    frameworks,
  )
    .map((group) => group
      .set(
        'entityGroups',
        makeEntityGroups(
          group.get('entities'),
          taxonomies,
          connectedTaxonomies,
          config,
          subgroupSelectValue,
          contextIntl,
          frameworks,
        )
      )
      .delete('entities'))
  : makeEntityGroups(
    entities,
    taxonomies,
    connectedTaxonomies,
    config,
    groupSelectValue,
    contextIntl,
    frameworks,
  );

const makeEntityGroups = (
  entities,
  taxonomies,
  connectedTaxonomies,
  config,
  groupSelectValue,
  contextIntl,
  frameworks,
) => {
  if (groupSelectValue && isNumber(groupSelectValue)) {
    const taxonomy = taxonomies.get(groupSelectValue);
    return makeTaxonomyGroups(entities, taxonomy, contextIntl, frameworks);
  }
  return List().push(Map({ entities }));
};
const getCategoryLabel = (cat) => cat.getIn(['attributes', 'reference'])
  ? `${cat.getIn(['attributes', 'reference'])} ${cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name'])}`
  : cat.getIn(['attributes', 'title']) || cat.getIn(['attributes', 'name']);

const getTaxTitle = (id, contextIntl) => contextIntl ? contextIntl.formatMessage(appMessages.entities.taxonomies[id].single) : '';

export const makeTaxonomyGroups = (entities, taxonomy, contextIntl, frameworks) => {
  let groups = Map();
  entities.forEach((entity) => {
    let hasTaxCategory = false;
    // if entity has taxonomies
    const checkFrameworks = (
      frameworks
      && taxonomy.get('frameworkIds')
      && !!entity.getIn(['attributes', 'framework_id'])
    );
    const taxNotApplicable = checkFrameworks
      && !taxonomy.get('frameworkIds').find(
        (id) => qe(id, entity.getIn(['attributes', 'framework_id'])),
      );
    if (
      !taxNotApplicable
      && entity.get('categories')
    ) {
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
    if (taxNotApplicable) {
      if (groups.get('n/a')) {
        groups = groups.setIn(['n/a', 'entities'], groups.getIn(['n/a', 'entities']).push(entity));
      } else {
        groups = groups.set('n/a', Map({
          label: contextIntl.formatMessage(
            messages.notapplicable,
            {
              taxonomy: lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl)),
            }
          ),
          entities: List().push(entity),
          order: 'zzzzzzzz',
          id: 'n/a',
        }));
      }
    } else if (!hasTaxCategory) {
      if (groups.get('without')) {
        groups = groups.setIn(['without', 'entities'], groups.getIn(['without', 'entities']).push(entity));
      } else {
        groups = groups.set('without', Map({
          label: contextIntl.formatMessage(
            messages.without,
            {
              taxonomy: lowerCase(getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl)),
            }
          ),
          entities: List().push(entity),
          order: 'xxxxxxxx',
          id: 'without',
        }));
      }
    }
  }); // for each entities
  return groups.sortBy(
    (group) => group.get('order'),
    (a, b) => getEntitySortComparator(a, b, 'asc')
  ).toList();
};

export const setGroup = (entity, groupId) => entity.get('group')
  ? entity.set('group', List().push(entity.get('group')).push())
  : entity.set('group', groupId);

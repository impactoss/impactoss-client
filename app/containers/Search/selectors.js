import { createSelector } from 'reselect';
import { Map, fromJS } from 'immutable';
// import { reduce } from 'lodash/collection';

import {
  selectEntitiesAll,
  selectSearchQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  attributesEqual,
  filterEntitiesByKeywords,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';


const selectPathQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('path')
);

// kicks off series of cascading selectors
export const selectEntitiesByQuery = createSelector(
  selectEntitiesAll,
  selectTaxonomiesSorted,
  (state, locationQuery) => selectSearchQuery(state, locationQuery),
  selectPathQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  (allEntities, taxonomies, searchQuery, path, sort, order) => {
    // console.log('selectEntitiesByQuery', searchQuery)
    let active = false;// || CONFIG.search[0].targets[0].path;
    return fromJS(CONFIG.search).map((group) => {
      if (group.get('group') === 'taxonomies') {
        return group.set('targets', taxonomies.map((tax) => {
          const categories = allEntities
            .get('categories')
            .filter((cat) =>
              attributesEqual(tax.get('id'), cat.getIn(['attributes', 'taxonomy_id']))
            )
            .map((cat) =>
              group.get('search').reduce((memo, attribute) =>
                memo.setIn(['attributes', attribute.get('as')], tax.getIn(['attributes', attribute.get('attribute')]))
              , cat)
            );

          const filteredCategories = searchQuery
            ? filterEntitiesByKeywords(
              categories,
              searchQuery,
              group.get('categorySearch').toArray()
            )
            : categories;
          if (path === `taxonomies-${tax.get('id')}` || (!path && !active && filteredCategories.size > 0)) {
            active = true;
            const sortOption = getSortOption(group.get('sorting') && group.get('sorting').toJS(), sort);
            return Map()
              .set('path', `taxonomies-${tax.get('id')}`)
              // .set('icon', `taxonomy_${tax.get('id')}`)
              .set('clientPath', 'category')
              .set('taxId', tax.get('id'))
              .set('active', searchQuery && true)
              .set('sorting', group.get('sorting'))
              .set('results', sortEntities(filteredCategories,
                order || (sortOption ? sortOption.order : 'desc'),
                sort || (sortOption ? sortOption.attribute : 'id'),
                sortOption ? sortOption.type : 'number'
              ));
          }
          return Map()
            .set('path', `taxonomies-${tax.get('id')}`)
            .set('clientPath', 'category')
            .set('taxId', tax.get('id'))
            .set('results', filteredCategories);
        }));
      }
      return group.set('targets', group.get('targets')
        .filter((target) => !!target)
        .map((target) => {
          const filteredEntities = searchQuery
            ? filterEntitiesByKeywords(
              allEntities.get(target.get('path')),
              searchQuery,
              target.get('search').toArray()
            )
            : allEntities.get(target.get('path'));
          if (path === target.get('path') || (!path && !active && filteredEntities.size > 0)) {
            active = true;
            // only sort the active entities that will be displayed
            const sortOption = getSortOption(target.get('sorting') && target.get('sorting').toJS(), sort);
            return target
              .set('active', searchQuery && true)
              .set('results', sortEntities(
                filteredEntities,
                order || (sortOption ? sortOption.order : 'desc'),
                sort || (sortOption ? sortOption.attribute : 'id'),
                sortOption ? sortOption.type : 'number'
              ));
          }
          return target.set('results', filteredEntities);
        })
      );
    });
  }
);

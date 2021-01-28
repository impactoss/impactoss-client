import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';
// import { reduce } from 'lodash/collection';

import {
  selectFWEntitiesAll,
  selectSearchQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectFWTaxonomiesSorted,
  selectActiveFrameworks,
} from 'containers/App/selectors';

import { filterEntitiesByKeywords } from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';


const selectPathQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('path')
);

// kicks off series of cascading selectors
export const selectEntitiesByQuery = createSelector(
  (state, locationQuery) => selectSearchQuery(state, locationQuery),
  selectFWEntitiesAll,
  selectFWTaxonomiesSorted,
  selectActiveFrameworks,
  selectPathQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  (searchQuery, allEntities, taxonomies, frameworks, path, sort, order) => {
    let active = false;// || CONFIG.search[0].targets[0].path;
    return fromJS(CONFIG.search).map((group) => {
      if (group.get('group') === 'taxonomies') {
        return group.set('targets', taxonomies.map((tax) => {
          const categories = allEntities
            .get('categories')
            .filter((cat) => qe(tax.get('id'), cat.getIn(['attributes', 'taxonomy_id'])))
            .map((cat) => group.get('search').reduce((memo, attribute) => memo.setIn(['attributes', attribute.get('as')], tax.getIn(['attributes', attribute.get('attribute')])),
              cat));

          const filteredCategories = searchQuery
            ? filterEntitiesByKeywords(
              categories,
              searchQuery,
              group.get('categorySearch').valueSeq().toArray()
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
                sortOption ? sortOption.type : 'number'));
          }
          return Map()
            .set('path', `taxonomies-${tax.get('id')}`)
            .set('clientPath', 'category')
            .set('taxId', tax.get('id'))
            .set('results', filteredCategories);
        }));
      }
      return group.set(
        'targets',
        group.get('targets')
          .filter((target) => !!target)
          .reduce(
            (memo, target) => {
              const targetEntties = allEntities.get(target.get('path'));
              // target by fw
              if (frameworks && target.get('groupByFramework')) {
                return frameworks.reduce((innerMemo, fw) => {
                  const fwEntities = targetEntties
                    .filter(
                      (entity) => qe(
                        entity.getIn(['attributes', 'framework_id']),
                        fw.get('id'),
                      )
                    );
                  const filteredEntities = searchQuery
                    ? filterEntitiesByKeywords(
                      fwEntities,
                      searchQuery,
                      target.get('search').valueSeq().toArray()
                    )
                    : fwEntities;
                  const fwTargetPath = `${target.get('path')}_${fw.get('id')}`;
                  const fwTarget = target
                    .set('clientPath', target.get('path'))
                    .set('path', fwTargetPath);

                  // if filtered by path
                  if (
                    path === fwTargetPath
                  || (
                    !path
                    && !active
                    && filteredEntities.size > 0
                  )
                  ) {
                    active = true;
                    // only sort the active entities that will be displayed
                    const sortOption = getSortOption(fwTarget.get('sorting') && fwTarget.get('sorting').toJS(), sort);
                    return innerMemo.push(
                      fwTarget
                        .set('active', searchQuery && true)
                        .set('results', sortEntities(
                          filteredEntities,
                          order || (sortOption ? sortOption.order : 'desc'),
                          sort || (sortOption ? sortOption.attribute : 'id'),
                          sortOption ? sortOption.type : 'number'
                        ))
                    );
                  }
                  return innerMemo.push(fwTarget.set('results', filteredEntities));
                }, memo);
              }
              // regular target
              const filteredEntities = searchQuery
                ? filterEntitiesByKeywords(
                  targetEntties,
                  searchQuery,
                  target.get('search').valueSeq().toArray()
                )
                : allEntities.get(target.get('path'));

              // if filtered by path
              if (
                path === target.get('path')
              || (
                !path
                && !active
                && filteredEntities.size > 0
              )
              ) {
                active = true;
                // only sort the active entities that will be displayed
                const sortOption = getSortOption(target.get('sorting') && target.get('sorting').toJS(), sort);
                return memo.push(
                  target
                    .set('active', searchQuery && true)
                    .set('results', sortEntities(
                      filteredEntities,
                      order || (sortOption ? sortOption.order : 'desc'),
                      sort || (sortOption ? sortOption.attribute : 'id'),
                      sortOption ? sortOption.type : 'number'
                    ))
                );
              }
              return memo.push(target.set('results', filteredEntities));
            },
            List(),
          )
      );
    });
  }
);

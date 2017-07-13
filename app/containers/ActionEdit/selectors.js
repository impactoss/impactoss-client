import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  attributesEqual,
  entitiesSetAssociated,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('measureEdit'),
  (substate) => substate.toJS()
);

export const selectMeasure = createSelector(
  (state, id) => selectEntity(state, { path: 'measures', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entity &&
    entity.set(
      'user',
      users
      .find((user) => attributesEqual(entity.getIn(['attributes', 'last_modified_user_id']), user.get('id')))
    )
);
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, measureCategories) => taxonomies &&
    taxonomies
    .filter((tax) => tax.getIn(['attributes', 'tags_measures']))
    .map((tax) => tax.set('categories', entitiesSetAssociated(
      categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id'))),
      'category_id',
      measureCategories,
      'measure_id',
      id
    )))
);

export const selectRecommendations = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, recommendations, associations) =>
    entitiesSetAssociated(recommendations, 'recommendation_id', associations, 'measure_id', id)
);
export const selectSdgTargets = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (id, sdgtargets, associations) =>
    entitiesSetAssociated(sdgtargets, 'sdgtarget_id', associations, 'measure_id', id)
);
export const selectIndicators = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, indicators, associations) =>
    entitiesSetAssociated(indicators, 'indicator_id', associations, 'measure_id', id)
);

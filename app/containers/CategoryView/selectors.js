import { createSelector } from 'reselect';
import { ENABLE_SDGS } from 'themes/config';

import {
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectSdgTargetConnections,
  selectMeasureConnections,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  attributesEqual,
  entitiesIsAssociated,
} from 'utils/entities';

export const selectCategory = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (category) => category
);
export const selectTaxonomy = createSelector(
  selectCategory,
  (state) => selectTaxonomiesSorted(state),
  (category, taxonomies) => category && taxonomies &&
    taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString())
);

export const selectViewEntity = createSelector(
  selectCategory,
  (state) => selectEntities(state, 'users'),
  (state) => selectTaxonomiesSorted(state),
  (entity, users, taxonomies) => entitySetSingles(entity, [
    {
      related: users,
      key: 'user',
      relatedKey: 'last_modified_user_id',
    },
    {
      related: users,
      key: 'manager',
      relatedKey: 'manager_id',
    },
    {
      related: taxonomies,
      key: 'taxonomy',
      relatedKey: 'taxonomy_id',
    },
  ])
);

export const selectTagsRecommendations = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_recommendations'])
);

export const selectRecommendationsAssociated = createSelector(
  selectTagsRecommendations,
  (state, id) => id,
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (tags, id, entities, associations) => tags
    ? entitiesIsAssociated(entities, 'recommendation_id', associations, 'category_id', id)
    : null
);

// all connected recommendations
export const selectRecommendations = createSelector(
  selectRecommendationsAssociated,
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (recommendations, connections, recMeasures, recCategories) =>
    recommendations && recommendations.map((rec) => rec
      .set('categories', recCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('measures', recMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
    )
);

export const selectTagsMeasures = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_measures'])
);

export const selectMeasuresAssociated = createSelector(
  selectTagsMeasures,
  (state, id) => id,
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (tags, id, entities, associations) => tags
    ? entitiesIsAssociated(entities, 'measure_id', associations, 'category_id', id)
    : null
);

// all connected measures
export const selectMeasures = createSelector(
  selectMeasuresAssociated,
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (measures, connections, measureTargets, measureRecommendations, measureCategories, measureIndicators) =>
    measures && measures.map((measure) => measure
      .set('categories', measureCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('sdgtargets', ENABLE_SDGS && measureTargets
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
      .set('recommendations', measureRecommendations
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
      )
      .set('indicators', measureIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);

export const selectTagsTargets = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_sdgtargets'])
);

export const selectTargetsAssociated = createSelector(
  selectTagsTargets,
  (state, id) => id,
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (tags, id, entities, associations) => tags
    ? entitiesIsAssociated(entities, 'sdgtarget_id', associations, 'category_id', id)
    : null
);

// all connected sdgTargets
export const selectSdgTargets = createSelector(
  selectTargetsAssociated,
  (state) => selectSdgTargetConnections(state),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (targets, connections, targetMeasures, targetCategories, targetIndicators) =>
    targets && targets.map((target) => target
    .set('categories', targetCategories
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
      )
      .map((association) => association.getIn(['attributes', 'category_id']))
    )
    .set('measures', targetMeasures
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
        && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'measure_id']))
    )
    .set('indicators', targetIndicators
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
        && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'indicator_id']))
    )
  )
);

export const selectTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    taxonomies.map((tax) => tax.set(
      'categories',
      categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')))
    ))
);

import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectSdgTargetConnections,
  selectMeasureConnections,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  attributesEqual,
  entitiesIsAssociated,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'taxonomies'),
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

// all connected recommendations
export const selectRecommendations = createSelector(
  (state, id) => id,
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, category, taxonomies, connections, recommendations, recMeasures, recCategories) => {
    const taxonomy = category && taxonomies && taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString());
    return (taxonomy && taxonomy.getIn(['attributes', 'tags_recommendations']) && recommendations)
      ? entitiesIsAssociated(recommendations, 'recommendation_id', recCategories, 'category_id', id)
      .map((rec) => rec
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
      : null;
  }
);

// all connected measures
export const selectMeasures = createSelector(
  (state, id) => id,
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, category, taxonomies, connections, measures, measureTargets, measureRecommendations, measureCategories, measureIndicators) => {
    const taxonomy = category && taxonomies && taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString());
    return (taxonomy && taxonomy.getIn(['attributes', 'tags_measures']) && measures)
      ? entitiesIsAssociated(measures, 'measure_id', measureCategories, 'category_id', id)
      .map((measure) => measure
        .set('categories', measureCategories
          .filter((association) =>
            attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          )
          .map((association) => association.getIn(['attributes', 'category_id']))
        )
        .set('sdgtargets', measureTargets
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
          .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
        )
        .set('indicators', measureIndicators
          .filter((association) =>
            attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
            && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
          )
          .map((association) => association.getIn(['attributes', 'indicator_id']))
        )
      )
      : null;
  }
);

// all connected sdgTargets
export const selectSdgTargets = createSelector(
  (state, id) => id,
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectSdgTargetConnections(state),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (id, category, taxonomies, connections, targets, targetMeasures, targetCategories, targetIndicators) => {
    const taxonomy = category && taxonomies && taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString());
    return taxonomy && taxonomy.getIn(['attributes', 'tags_sdgtargets']) && targets
      ? entitiesIsAssociated(targets, 'sdgtarget_id', targetCategories, 'category_id', id)
      .map((target) => target
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
      : null;
  }
);

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    taxonomies.map((tax) => tax.set(
      'categories',
      categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')))
    ))
);

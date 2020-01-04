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

import { sortEntities, sortCategories } from 'utils/sort';

export const selectCategory = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (category) => category
);
export const selectTaxonomy = createSelector(
  selectCategory,
  selectTaxonomiesSorted,
  (category, taxonomies) => category && taxonomies &&
    taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString())
);

export const selectViewEntity = createSelector(
  selectCategory,
  (state) => selectEntities(state, 'users'),
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (entity, users, taxonomies, categories) => entity && entitySetSingles(entity, [
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
    {
      related: categories,
      key: 'category',
      relatedKey: 'parent_id',
    },
  ])
);

export const selectParentTaxonomy = createSelector(
  selectCategory,
  (state) => selectEntities(state, 'taxonomies'),
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find((tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')));
      return taxonomies.find((tax) => attributesEqual(taxonomy.getIn(['attributes', 'parent_id']), tax.get('id')));
    }
    return null;
  });
export const selectChildTaxonomies = createSelector(
  selectCategory,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (entity, taxonomies, categories) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find((tax) => attributesEqual(entity.getIn(['attributes', 'taxonomy_id']), tax.get('id')));
      return taxonomies
        .filter((tax) => attributesEqual(tax.getIn(['attributes', 'parent_id']), taxonomy.get('id')))
        .map((tax) =>
          tax.set('categories', sortCategories(categories, tax.get('id'))
            .filter((cat) =>
              attributesEqual(cat.getIn(['attributes', 'parent_id']), entity.get('id'))
              && attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')))
          )
        );
    }
    return null;
  });

const selectTagsRecommendations = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_recommendations'])
);

const selectRecommendationsAssociated = createSelector(
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
  selectRecommendationConnections,
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (recommendations, connections, recMeasures, recCategories) =>
    recommendations && recommendations.map((rec) => rec
      .set('categories', recCategories && recCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('measures', recMeasures && recMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
    )
);

const selectChildrenTagRecommendations = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies && taxonomies.some((tax) => tax.getIn(['attributes', 'tags_recommendations']))
);

const selectChildRecommendationsAssociated = createSelector(
  selectChildrenTagRecommendations,
  selectChildTaxonomies,
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (tag, childTaxonomies, entities, associations) => tag && childTaxonomies
    ? childTaxonomies.map((tax) =>
      tax.set('categories', tax.get('categories').map((cat) =>
        cat.set(
          'recommendations',
          sortEntities(
            entitiesIsAssociated(entities, 'recommendation_id', associations, 'category_id', cat.get('id')),
            'asc',
            'reference',
          ),
        )
      ))
    )
    : null
);

// all connected recommendations
export const selectChildRecommendations = createSelector(
  selectChildRecommendationsAssociated,
  selectRecommendationConnections,
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (recommendationsByTaxCat, connections, recMeasures, recCategories) =>
    recommendationsByTaxCat && recommendationsByTaxCat.map(
      (tax) => tax.set('categories', tax.get('categories').map(
        (cat) => cat.set('recommendations', cat.get('recommendations').map(
          (rec) => rec
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
          ))
        ))
      )
);

const selectTagsMeasures = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_measures'])
);

const selectMeasuresAssociated = createSelector(
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
  selectMeasureConnections,
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (measures, connections, measureTargets, measureRecommendations, measureCategories, measureIndicators) =>
    measures && measures.map((measure) => measure
      .set('categories', measureCategories && measureCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('sdgtargets', ENABLE_SDGS && measureTargets && measureTargets
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
      .set('recommendations', measureRecommendations && measureRecommendations
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
      )
      .set('indicators', measureIndicators && measureIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);

const selectChildrenTagMeasures = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies && taxonomies.some((tax) => tax.getIn(['attributes', 'tags_measures']))
);

const selectChildMeasuresAssociated = createSelector(
  selectChildrenTagMeasures,
  selectChildTaxonomies,
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (tag, childTaxonomies, entities, associations) => tag
    ? childTaxonomies.map((tax) =>
      tax.set('categories', tax.get('categories').map((cat) =>
        cat.set(
          'measures',
          sortEntities(
            entitiesIsAssociated(entities, 'measure_id', associations, 'category_id', cat.get('id')),
            'asc',
            'reference',
          ),
        )
      ))
    )
    : null
);

// all connected recommendations
export const selectChildMeasures = createSelector(
  selectChildMeasuresAssociated,
  selectMeasureConnections,
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (measuresByTaxCat, connections, measureTargets, measureRecommendations, measureCategories, measureIndicators) =>
    measuresByTaxCat && measuresByTaxCat.map(
      (tax) => tax.set('categories', tax.get('categories').map(
        (cat) => cat.set('measures', cat.get('measures').map(
          (measure) => measure
            .set('categories', measureCategories && measureCategories
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
              )
              .map((association) => association.getIn(['attributes', 'category_id']))
            )
            .set('sdgtargets', ENABLE_SDGS && measureTargets && measureTargets
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
                && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
              )
              .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
            )
            .set('recommendations', measureRecommendations && measureRecommendations
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
                && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
              )
              .map((association) => association.getIn(['attributes', 'recommendation_id']))
            )
            .set('indicators', measureIndicators && measureIndicators
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
                && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
              )
              .map((association) => association.getIn(['attributes', 'indicator_id']))
            )
          ))
        ))
      )
);

const selectTagsTargets = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_sdgtargets'])
);

const selectTargetsAssociated = createSelector(
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
  selectSdgTargetConnections,
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (targets, connections, targetMeasures, targetCategories, targetIndicators) =>
    targets && targets.map((target) => target
    .set('categories', targetCategories && targetCategories
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
      )
      .map((association) => association.getIn(['attributes', 'category_id']))
    )
    .set('measures', targetMeasures && targetMeasures
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
        && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'measure_id']))
    )
    .set('indicators', targetIndicators && targetIndicators
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
        && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'indicator_id']))
    )
  )
);

const selectChildrenTagTargets = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies && taxonomies.some((tax) => tax.getIn(['attributes', 'tags_sdgtargets']))
);

const selectChildTargetsAssociated = createSelector(
  selectChildrenTagTargets,
  selectChildTaxonomies,
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (tag, childTaxonomies, entities, associations) => tag
    ? childTaxonomies.map((tax) =>
      tax.set('categories', tax.get('categories').map((cat) =>
        cat.set(
          'sdgtargets',
          sortEntities(
            entitiesIsAssociated(entities, 'sdgtarget_id', associations, 'category_id', cat.get('id')),
            'asc',
            'reference',
          ),
        )
      ))
    )
    : null
);

// all connected recommendations
export const selectChildSdgTargets = createSelector(
  selectChildTargetsAssociated,
  selectSdgTargetConnections,
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (targetsByTaxCat, connections, targetMeasures, targetCategories, targetIndicators) =>
    targetsByTaxCat && targetsByTaxCat.map(
      (tax) => tax.set('categories', tax.get('categories').map(
        (cat) => cat.set('measures', cat.get('measures').map(
          (target) => target
            .set('categories', targetCategories && targetCategories
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
              )
              .map((association) => association.getIn(['attributes', 'category_id']))
            )
            .set('measures', targetMeasures && targetMeasures
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
                && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
              )
              .map((association) => association.getIn(['attributes', 'measure_id']))
            )
            .set('indicators', targetIndicators && targetIndicators
              .filter((association) =>
                attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
                && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
              )
              .map((association) => association.getIn(['attributes', 'indicator_id']))
            )
          ))
        ))
      )
);

export const selectTaxonomies = createSelector(
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    taxonomies.map((tax) => tax.set(
      'categories',
      categories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), tax.get('id')))
    ))
);

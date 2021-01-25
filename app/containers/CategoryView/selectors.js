import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectMeasureConnections,
  selectTaxonomiesSorted,
  selectTaxonomies,
  selectFWRecommendations,
  selectFWMeasures,
  selectRecommendationCategoriesByCategory,
  selectMeasureCategoriesByCategory,
  selectRecommendationMeasuresByMeasure,
  selectMeasureCategoriesByMeasure,
  selectMeasureIndicatorsByMeasure,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  selectRecommendationIndicatorsByRecommendation,
  selectFrameworks,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  getEntityCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, sortCategories } from 'utils/sort';

import { DEPENDENCIES } from './constants';

export const selectCategory = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (category) => category
);
export const selectTaxonomy = createSelector(
  selectCategory,
  selectTaxonomiesSorted,
  (category, taxonomies) => category
    && taxonomies
    && taxonomies.get(category.getIn(['attributes', 'taxonomy_id']).toString())
);

export const selectViewEntity = createSelector(
  selectCategory,
  (state) => selectEntities(state, 'users'),
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (entity, users, taxonomies, categories) => entity
    && entitySetSingles(
      entity, [
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
      ],
    )
);

export const selectParentTaxonomy = createSelector(
  selectCategory,
  selectTaxonomies,
  (entity, taxonomies) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id'),
        )
      );
      return taxonomies.find(
        (tax) => qe(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id')
        )
      );
    }
    return null;
  }
);
export const selectChildTaxonomies = createSelector(
  selectCategory,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (entity, taxonomies, categories) => {
    if (entity && taxonomies) {
      const taxonomy = taxonomies.find(
        (tax) => qe(
          entity.getIn(['attributes', 'taxonomy_id']),
          tax.get('id')
        ),
      );
      return taxonomies.filter(
        (tax) => qe(
          tax.getIn(['attributes', 'parent_id']),
          taxonomy.get('id')
        )
      ).map(
        (tax) => tax.set(
          'categories',
          sortCategories(
            categories.filter(
              (cat) => qe(
                cat.getIn(['attributes', 'parent_id']),
                entity.get('id')
              ) && qe(
                cat.getIn(['attributes', 'taxonomy_id']),
                tax.get('id')
              )
            ),
            tax.get('id'),
          )
        )
      );
    }
    return null;
  }
);

const selectTagsRecommendations = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_recommendations'])
);

const selectRecommendationAssociations = createSelector(
  (state, id) => id,
  selectRecommendationCategoriesByCategory,
  (catId, associations) => associations.get(
    parseInt(catId, 10)
  )
);
const selectRecommendationsAssociated = createSelector(
  selectTagsRecommendations,
  selectRecommendationAssociations,
  selectFWRecommendations,
  (tags, associations, recommendations) => tags
    ? associations && associations.reduce(
      (memo, id) => {
        const entity = recommendations.get(id.toString());
        return entity
          ? memo.set(id, entity)
          : memo;
      },
      Map(),
    )
    : null,
);

export const selectRecommendations = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectRecommendationsAssociated,
  selectRecommendationConnections,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  selectRecommendationIndicatorsByRecommendation,
  (state) => selectEntities(state, 'categories'),
  (state) => selectFrameworks(state),
  (
    ready,
    recommendations,
    connections,
    recommendationMeasures,
    recommendationCategories,
    recommendationIndicators,
    categories,
    frameworks,
  ) => {
    if (!ready) return Map();
    return recommendations
      && recommendationIndicators
      && frameworks
      && recommendations.filter(
        (rec) => {
          const currentFramework = frameworks.find(
            (fw) => qe(fw.get('id'), rec && rec.getIn(['attributes', 'framework_id']))
          );
          return currentFramework && currentFramework.getIn(['attributes', 'has_measures']);
        }
      ).map(
        (rec) => rec && rec.set(
          'categories',
          getEntityCategories(
            rec.get('id'),
            recommendationCategories,
            categories,
          )
        ).set(
          'measures',
          recommendationMeasures.get(parseInt(rec.get('id'), 10))
        ).set(
          'indicators',
          recommendationIndicators.get(parseInt(rec.get('id'), 10))
        )
      ).groupBy(
        (r) => r.getIn(['attributes', 'framework_id'])
      );
  }
);

const selectChildrenTagRecommendations = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies
    && taxonomies.some(
      (tax) => tax.getIn(['attributes', 'tags_recommendations']),
    )
);

const selectChildRecommendationsAssociated = createSelector(
  selectChildrenTagRecommendations,
  selectChildTaxonomies,
  selectFWRecommendations,
  selectRecommendationCategoriesByCategory,
  (tag, childTaxonomies, recommendations, associations) => tag && childTaxonomies
    ? childTaxonomies.map(
      (tax) => tax.set(
        'categories',
        tax.get('categories').map(
          (cat) => {
            const recIds = associations.get(
              parseInt(cat.get('id'), 10)
            );
            return cat.set(
              'recommendations',
              recIds
                ? sortEntities(
                  recIds.map(
                    (id) => recommendations.get(id.toString())
                  ),
                  'asc',
                  'reference',
                )
                : Map(),
            );
          }
        )
      )
    )
    : null
);

// all connected recommendations
export const selectChildRecommendations = createSelector(
  selectChildRecommendationsAssociated,
  selectRecommendationConnections,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  (state) => selectEntities(state, 'categories'),
  (
    recommendationsByTaxCat,
    connections,
    recMeasures,
    recCategories,
    categories,
  ) => recommendationsByTaxCat && recommendationsByTaxCat.map(
    (tax) => tax.set(
      'categories',
      tax.get('categories').map(
        (cat) => cat.set(
          'recommendations',
          cat.get('recommendations').map(
            (rec) => rec.set(
              'categories',
              getEntityCategories(
                rec.get('id'),
                recCategories,
                categories,
              )
            ).set(
              'measures',
              recMeasures.get(parseInt(rec.get('id'), 10))
            )
          )
        )
      )
    )
  ).groupBy(
    (r) => r.getIn(['attributes', 'framework_id'])
  )
);

const selectTagsMeasures = createSelector(
  selectTaxonomy,
  (taxonomy) => taxonomy && taxonomy.getIn(['attributes', 'tags_measures'])
);

const selectMeasureAssociations = createSelector(
  (state, id) => id,
  selectMeasureCategoriesByCategory,
  (catId, associations) => associations.get(
    parseInt(catId, 10)
  )
);
const selectMeasuresAssociated = createSelector(
  selectTagsMeasures,
  selectMeasureAssociations,
  selectFWMeasures,
  (tags, associations, measures) => tags
    ? associations && associations.map(
      (id) => measures.get(id.toString())
    )
    : null
);

// all connected measures
export const selectMeasures = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectMeasuresAssociated,
  selectMeasureConnections,
  selectRecommendationMeasuresByMeasure,
  selectMeasureCategoriesByMeasure,
  selectMeasureIndicatorsByMeasure,
  (state) => selectEntities(state, 'categories'),
  (
    ready,
    measures,
    connections,
    measureRecommendations,
    measureCategories,
    measureIndicators,
    categories,
  ) => {
    if (!ready) return Map();
    return measures && measures.map(
      (measure) => {
        const entityRecs = measureRecommendations.get(parseInt(measure.get('id'), 10));
        const entityRecsByFw = entityRecs
          && connections.get('recommendations')
          && entityRecs.filter(
            (recId) => connections.getIn([
              'recommendations',
              recId.toString(),
            ])
          ).groupBy(
            (recId) => connections.getIn([
              'recommendations',
              recId.toString(),
              'attributes',
              'framework_id',
            ]).toString()
          );
        return measure.set(
          'categories',
          getEntityCategories(
            measure.get('id'),
            measureCategories,
            categories,
          )
        ).set(
          'indicators',
          measureIndicators.get(parseInt(measure.get('id'), 10))
        // currently needs both
        ).set(
          'recommendations',
          entityRecs
        // nest connected recommendation ids byfw
        ).set(
          'recommendationsByFw',
          entityRecsByFw,
        );
      }
    );
  }
);

const selectChildrenTagMeasures = createSelector(
  selectChildTaxonomies,
  (taxonomies) => taxonomies && taxonomies.some(
    (tax) => tax.getIn(['attributes', 'tags_measures'])
  )
);

const selectChildMeasuresAssociated = createSelector(
  selectChildrenTagMeasures,
  selectChildTaxonomies,
  selectFWMeasures,
  selectMeasureCategoriesByCategory,
  (tag, childTaxonomies, measures, associations) => tag
    ? childTaxonomies.map(
      (tax) => tax.set(
        'categories',
        tax.get('categories').map(
          (cat) => {
            const measureIds = associations.get(
              parseInt(cat.get('id'), 10)
            );
            return cat.set(
              'measures',
              measureIds
                ? sortEntities(
                  measureIds.map(
                    (id) => measures.get(id.toString())
                  ),
                  'asc',
                  'reference',
                )
                : Map(),
            );
          }
        )
      )
    )
    : null
);

// all connected recommendations
export const selectChildMeasures = createSelector(
  selectChildMeasuresAssociated,
  selectMeasureConnections,
  selectRecommendationMeasuresByMeasure,
  selectMeasureCategoriesByMeasure,
  selectMeasureIndicatorsByMeasure,
  (state) => selectEntities(state, 'categories'),
  (
    measuresByTaxCat,
    connections,
    measureRecommendations,
    measureCategories,
    measureIndicators,
    categories,
  ) => measuresByTaxCat && measuresByTaxCat.map(
    (tax) => tax.set(
      'categories',
      tax.get('categories').map(
        (cat) => cat.set(
          'measures',
          cat.get('measures').map(
            (measure) => measure.set(
              'categories',
              getEntityCategories(
                measure.get('id'),
                measureCategories,
                categories,
              )
            ).set(
              'recommendations',
              measureRecommendations.get(parseInt(measure.get('id'), 10)),
            ).set(
              'indicators',
              measureIndicators.get(parseInt(measure.get('id'), 10)),
            )
          )
        )
      )
    )
  )
);

export const selectTaxonomiesWithCategories = createSelector(
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies.map((tax) => tax.set(
    'categories',
    categories.filter(
      (cat) => qe(
        cat.getIn(['attributes', 'taxonomy_id']),
        tax.get('id')
      )
    )
  ))
);

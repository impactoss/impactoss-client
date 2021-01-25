import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectIndicatorConnections,
  selectFWTaxonomiesSorted,
  selectFWRecommendations,
  selectFWIndicators,
  selectFrameworks,
  selectRecommendationMeasuresByMeasure,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  selectRecommendationIndicatorsByRecommendation,
  selectRecommendationIndicatorsByIndicator,
  selectMeasureIndicatorsByMeasure,
  selectMeasureIndicatorsByIndicator,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
  getEntityCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'measures', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

// TODO optimise use selectMeasureCategoriesByMeasure
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, associations) => prepareTaxonomiesIsAssociated(
    taxonomies,
    categories,
    associations,
    'tags_measures',
    'measure_id',
    id,
  )
);

const selectRecommendationAssociations = createSelector(
  (state, id) => id,
  selectRecommendationMeasuresByMeasure,
  (measureId, associations) => associations.get(
    parseInt(measureId, 10)
  )
);
const selectRecommendationsAssociated = createSelector(
  selectRecommendationAssociations,
  selectFWRecommendations,
  (associations, recommendations) => associations
    && associations.reduce(
      (memo, id) => {
        const entity = recommendations.get(id.toString());
        return entity
          ? memo.set(id, entity)
          : memo;
      },
      Map(),
    )
);

// all connected recommendations
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
            (fw) => qe(fw.get('id'), rec.getIn(['attributes', 'framework_id']))
          );
          return currentFramework.getIn(['attributes', 'has_measures']);
        }
      ).map(
        (rec) => rec.set(
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

const selectIndicatorAssociations = createSelector(
  (state, id) => id,
  selectMeasureIndicatorsByMeasure,
  (measureId, associations) => associations.get(
    parseInt(measureId, 10)
  )
);
const selectIndicatorsAssociated = createSelector(
  selectIndicatorAssociations,
  selectFWIndicators,
  (associations, indicators) => associations
    && associations.reduce(
      (memo, id) => {
        const entity = indicators.get(id.toString());
        return entity
          ? memo.set(id, entity)
          : memo;
      },
      Map(),
    )
);

// selectIndicators,
export const selectIndicators = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectIndicatorsAssociated,
  (state) => selectIndicatorConnections(state),
  selectMeasureIndicatorsByIndicator,
  selectRecommendationIndicatorsByIndicator,
  (
    ready,
    indicators,
    connections,
    indicatorMeasures,
    indicatorRecs,
  ) => {
    if (!ready) return Map();
    return indicators && indicators.map(
      (indicator) => {
        const entityRecs = indicatorRecs.get(parseInt(indicator.get('id'), 10));
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
        return indicator.set(
          'measures',
          indicatorMeasures.get(parseInt(indicator.get('id'), 10))
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

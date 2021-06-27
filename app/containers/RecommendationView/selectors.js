import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectTaxonomiesSorted,
  selectIndicatorConnections,
  selectFWMeasures,
  selectFWIndicators,
  selectRecommendationMeasuresByMeasure,
  selectMeasureCategoriesByMeasure,
  selectMeasureIndicatorsByMeasure,
  selectMeasureIndicatorsByIndicator,
  selectRecommendationIndicatorsByIndicator,
  selectRecommendationIndicatorsByRecommendation,
  selectRecommendationMeasuresByRecommendation,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
  getEntityCategories,
} from 'utils/entities';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

// TODO optimise use selectRecommendationCategoriesByRecommendation
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, taxonomies, categories, associations) => prepareTaxonomiesIsAssociated(
    taxonomies,
    categories,
    associations,
    'tags_recommendations',
    'recommendation_id',
    id,
  )
);

const selectMeasureAssociations = createSelector(
  (state, id) => id,
  selectRecommendationMeasuresByRecommendation,
  (recommendationId, associations) => associations.get(
    parseInt(recommendationId, 10)
  )
);
const selectMeasuresAssociated = createSelector(
  selectMeasureAssociations,
  selectFWMeasures,
  (associations, measures) => associations
    && associations.reduce(
      (memo, id) => {
        const entity = measures.get(id.toString());
        return entity
          ? memo.set(id, entity)
          : memo;
      },
      Map(),
    )
);
// all connected measures
export const selectMeasures = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectMeasuresAssociated,
  (state) => selectMeasureConnections(state),
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

const selectIndicatorAssociations = createSelector(
  (state, id) => id,
  selectRecommendationIndicatorsByRecommendation,
  (recommendationId, associations) => associations.get(
    parseInt(recommendationId, 10)
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

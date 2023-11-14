import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectReady,
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectRecommendationConnections,
  selectFWRecommendations,
  selectFWMeasures,
  selectFrameworks,
  selectRecommendationMeasuresByMeasure,
  selectMeasureIndicatorsByMeasure,
  selectMeasureIndicatorsByIndicator,
  selectMeasureCategoriesByMeasure,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationCategoriesByRecommendation,
  selectRecommendationIndicatorsByRecommendation,
  selectRecommendationIndicatorsByIndicator,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  entitySetSingle,
  getEntityCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities } from 'utils/sort';

import { DEPENDENCIES } from './constants';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'indicators', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetSingles(entity, [
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
  ])
);
const selectMeasureAssociations = createSelector(
  (state, id) => id,
  selectMeasureIndicatorsByIndicator,
  (indicatorId, associations) => associations.get(
    parseInt(indicatorId, 10)
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

const selectRecommendationAssociations = createSelector(
  (state, id) => id,
  selectRecommendationIndicatorsByIndicator,
  (indicatorId, associations) => associations.get(
    parseInt(indicatorId, 10)
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
// all connected recs
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
          return currentFramework.getIn(['attributes', 'has_indicators']);
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

// all connected reports
export const selectReports = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  (state) => selectEntities(state, 'users'),
  (id, reports, dates, users) => {
    const filtered = reports.filter(
      (report) => qe(
        report.getIn(['attributes', 'indicator_id']),
        id,
      )
    ).map(
      (report) => {
        const reportX = report.set(
          'user',
          users.find(
            (user) => report.getIn(['attributes', 'last_modified_user_id'])
              && qe(
                user.get('id'),
                report.getIn(['attributes', 'last_modified_user_id'])
              )
          )
        );
        return entitySetSingle(
          reportX,
          dates,
          'due_date',
          'due_date_id'
        );
      }
    );
    return reports && sortEntities(
      filtered,
      'desc',
      'dueDateThenUpdated',
      'date'
    );
  }
);

export const selectDueDates = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'due_dates'),
  (id, dates) => dates && sortEntities(
    dates.filter(
      (date) => qe(
        date.getIn(['attributes', 'indicator_id']),
        id,
      ) && !date.getIn(['attributes', 'has_progress_report'])
    ),
    'asc',
    'due_date',
    'date',
  )
);
// without: {
//   path: 'progress_reports',
//   key: 'due_date_id',
// },

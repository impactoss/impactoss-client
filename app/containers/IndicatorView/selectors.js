import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectRecommendationConnections,
  selectFWRecommendations,
  selectFWMeasures,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  entitySetSingle,
  attributesEqual,
  entitiesIsAssociated,
  getEntityCategories,
} from 'utils/entities';

import { sortEntities } from 'utils/sort';

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
export const selectMeasuresAssociated = createSelector(
  (state, id) => id,
  selectFWMeasures,
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'measure_id', associations, 'indicator_id', id)
);
// all connected measures
export const selectMeasures = createSelector(
  selectMeasuresAssociated,
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'categories'),
  (measures, connections, measureRecommendations, measureCategories, measureIndicators, categories) =>
    measures && measures
    .map((measure) => measure
      .set('categories', getEntityCategories(measure.get('id'), measureCategories, 'measure_id', categories))
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
// all connected reports
export const selectReports = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  (state) => selectEntities(state, 'users'),
  (id, reports, dates, users) =>
    reports && sortEntities(
      reports
        .filter((report) => attributesEqual(report.getIn(['attributes', 'indicator_id']), id))
        .map((report) =>
          entitySetSingle(
            report.set('user',
              users.find((user) => report.getIn(['attributes', 'last_modified_user_id']) && attributesEqual(user.get('id'), report.getIn(['attributes', 'last_modified_user_id'])))
            ),
            dates,
            'due_date',
            'due_date_id'
          )
        ),
      'desc',
      'dueDateThenUpdated',
      'date'
    )
);

export const selectDueDates = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'due_dates'),
  (id, dates) =>
    dates && sortEntities(
      dates.filter((date) =>
        attributesEqual(date.getIn(['attributes', 'indicator_id']), id)
        && !date.getIn(['attributes', 'has_progress_report'])
      ), 'asc', 'due_date', 'date'
    )
);
// without: {
//   path: 'progress_reports',
//   key: 'due_date_id',
// },

export const selectRecommendationsAssociated = createSelector(
  (state, id) => id,
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_indicators'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'recommendation_id', associations, 'indicator_id', id)
);
// all connected recs
export const selectRecommendations = createSelector(
  selectRecommendationsAssociated,
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (state) => selectEntities(state, 'categories'),
  (recommendations, connections, recommendationMeasures, recommendationCategories, recommendationIndicators, categories) =>
    recommendations && recommendationIndicators && recommendations
    .map((rec) => rec
      .set('categories', getEntityCategories(rec.get('id'), recommendationCategories, 'recommendation_id', categories))
      .set('measures', recommendationMeasures && recommendationMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('indicators', recommendationIndicators && recommendationIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);

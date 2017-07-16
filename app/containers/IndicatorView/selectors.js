import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectSdgTargetConnections,
} from 'containers/App/selectors';

import {
  entitySetSingles,
  entitySetSingle,
  attributesEqual,
  entitiesIsAssociated,
} from 'utils/entities';

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

// all connected measures
export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, connections, measures, measureTargets, measureRecommendations, measureCategories, measureIndicators) =>
    measures && measureTargets && entitiesIsAssociated(measures, 'measure_id', measureIndicators, 'indicator_id', id)
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
);
// all connected sdgTargets
export const selectSdgTargets = createSelector(
  (state, id) => id,
  (state) => selectSdgTargetConnections(state),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (id, connections, targets, targetMeasures, targetCategories, targetIndicators) =>
    targets && targetMeasures && entitiesIsAssociated(targets, 'sdgtarget_id', targetIndicators, 'indicator_id', id)
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
);

// all connected reports
export const selectReports = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  (id, reports, dates) =>
    reports && reports
      .filter((report) => attributesEqual(report.getIn(['attributes', 'indicator_id']), id))
      .map((report) => entitySetSingle(report, dates, 'due_date', 'due_date_id'))
);

export const selectDueDates = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'due_dates'),
  (id, dates) =>
    dates && dates
    .filter((date) =>
      attributesEqual(date.getIn(['attributes', 'indicator_id']), id)
      && !date.getIn(['attributes', 'has_progress_report'])
    )
);
// without: {
//   path: 'progress_reports',
//   key: 'due_date_id',
// },

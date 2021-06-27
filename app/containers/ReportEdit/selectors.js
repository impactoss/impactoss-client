import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectFWIndicators,
} from 'containers/App/selectors';

import { entitySetUser } from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { sortEntities } from 'utils/sort';

export const selectDomain = createSelector(
  (state) => state.get('reportEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'progress_reports', id }),
  (state) => selectEntities(state, 'users'),
  selectFWIndicators,
  (state) => selectEntities(state, 'due_dates'),
  (entity, users, indicators, dates) => {
    if (entity) {
      let indicatorAssociated = indicators.find(
        (indicator) => qe(
          entity.getIn(['attributes', 'indicator_id']),
          indicator.get('id')
        )
      );
      // reports should alwasy have an indicator but checking here just in case (eg report is )
      const indicatorDates = indicatorAssociated && dates.filter(
        (date) => qe(
          date.getIn(['attributes', 'indicator_id']),
          indicatorAssociated.get('id')
        )
      );
      indicatorAssociated = indicatorDates
        && indicatorAssociated
        && indicatorAssociated.set(
          'dates',
          sortEntities(indicatorDates, 'asc', 'due_date', 'date')
        );
      return entitySetUser(entity.set('indicator', indicatorAssociated), users);
    }
    return entity;
  }
);

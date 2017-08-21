import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  entitySetUser,
  attributesEqual,
} from 'utils/entities';

import { sortEntities } from 'utils/sort';

export const selectDomain = createSelector(
  (state) => state.get('reportEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'progress_reports', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'due_dates'),
  (entity, users, indicators, dates) => {
    if (entity) {
      let indicatorAssociated = indicators
        .find((indicator) => attributesEqual(entity.getIn(['attributes', 'indicator_id']), indicator.get('id')));
      // reports should alwasy have an indicator but checking here just in case (eg report is )
      const indicatorDates = indicatorAssociated && dates
        .filter((date) => attributesEqual(date.getIn(['attributes', 'indicator_id']), indicatorAssociated.get('id')));
      indicatorAssociated = indicatorDates && indicatorAssociated && indicatorAssociated
        .set('dates', sortEntities(indicatorDates, 'asc', 'due_date', 'date'));
      return entitySetUser(entity.set('indicator', indicatorAssociated), users);
    }
    return entity;
  }
);

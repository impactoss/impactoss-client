import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  attributesEqual,
} from 'utils/entities';

import { sortEntities } from 'utils/sort';

export const selectDomain = createSelector(
  (state) => state.get('reportNew'),
  (substate) => substate.toJS()
);

export const selectIndicator = createSelector(
  (state, id) => selectEntity(state, { path: 'indicators', id }),
  (state) => selectEntities(state, 'due_dates'),
  (indicator, dates) => indicator && indicator
    .set('dates', sortEntities(
      dates.filter((date) => attributesEqual(date.getIn(['attributes', 'indicator_id']), indicator.get('id'))),
      'asc',
      'due_date',
      'date')
    )
);

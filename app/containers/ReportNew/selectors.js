import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import { qe } from 'utils/quasi-equals';

import { sortEntities } from 'utils/sort';

export const selectDomain = createSelector(
  (state) => state.get('reportNew'),
  (substate) => substate
);

export const selectIndicator = createSelector(
  (state, id) => selectEntity(state, { path: 'indicators', id }),
  (state) => selectEntities(state, 'due_dates'),
  (indicator, dates) => indicator && indicator.set(
    'dates',
    sortEntities(
      dates.filter(
        (date) => qe(
          date.getIn(['attributes', 'indicator_id']),
          indicator.get('id')
        )
      ),
      'asc',
      'due_date',
      'date'
    ),
  )
);

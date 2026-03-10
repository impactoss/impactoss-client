import { createSelector } from 'reselect';

import {
  selectEntity,
  selectDueDates,
} from 'containers/App/selectors';

import { qe } from 'utils/quasi-equals';

import { sortEntities } from 'utils/sort';

export const selectDomain = (state) => state.get('reportNew');

export const selectIndicator = createSelector(
  (state, id) => selectEntity(state, { path: 'indicators', id }),
  selectDueDates,
  (indicator, dates) => indicator && indicator.set(
    'dates',
    sortEntities(
      dates.filter(
        (date) => qe(
          date.getIn(['attributes', 'indicator_id']),
          indicator.get('id'),
        ),
      ),
      'asc',
      'due_date',
      'date',
    ),
  ),
);

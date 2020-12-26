import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectFWIndicators,
} from 'containers/App/selectors';

import {
  entitySetSingles,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'progress_reports', id }),
  (state) => selectEntities(state, 'users'),
  selectFWIndicators,
  (state) => selectEntities(state, 'due_dates'),
  (entity, users, indicators, dates) => entitySetSingles(entity, [
    {
      related: users,
      key: 'user',
      relatedKey: 'last_modified_user_id',
    },
    {
      related: indicators,
      key: 'indicator',
      relatedKey: 'indicator_id',
    },
    {
      related: dates,
      key: 'date',
      relatedKey: 'due_date_id',
    },
  ])
);

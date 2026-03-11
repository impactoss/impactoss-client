import { createSelector } from 'reselect';

import {
  selectEntity,
  selectUsers,
} from 'containers/App/selectors';

import { entitySetUser } from 'utils/entities';

export const selectDomain = (state) => state.get('pageEdit');

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'pages', id }),
  selectUsers,
  (entity, users) => entitySetUser(entity, users),
);

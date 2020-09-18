import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  entitySetUser,
} from 'utils/entities';

export const selectViewEntity = (state, id) => selectEntity(
  state, { path: 'bookmarks', id }
);

import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import { entitySetUser } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('pageEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'pages', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

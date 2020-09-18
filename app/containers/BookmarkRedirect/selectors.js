import {
  selectEntity,
} from 'containers/App/selectors';

export const selectViewEntity = (state, id) => selectEntity(
  state, { path: 'bookmarks', id }
);

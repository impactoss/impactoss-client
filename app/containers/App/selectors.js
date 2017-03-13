/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { slice } from 'lodash/array';
import { orderBy } from 'lodash/collection';

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

const getSortIteratee = (field) => {
  switch (field) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return (entity) => parseInt(entity.id, 10);
    default:
      return field;
  }
};

/**
* Use a make selector when different components will use a selector with different data
* https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
* otherwise use straight createSelector ( I think :/ )
* https://github.com/react-boilerplate/react-boilerplate/pull/1205#issuecomment-274319934
*
* Selectors with arguments, see this guide
* https://github.com/reactjs/reselect#q-how-do-i-create-a-selector-that-takes-an-argument
*/

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectAuth = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('auth').toJS()
);

const makeSelectSignedIn = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['user', 'isSignedIn'])
);

// makeSelectLocationState expects a plain JS object for the routing state
const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const makeSelectEmail = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['form', 'login', 'email'])
);
const makeSelectPassword = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['form', 'login', 'password'])
);

const makeSelectNextPathname = () => createSelector(
  selectRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'state', 'nextPathname']);
    } catch (error) {
      return null;
    }
  }
);

const requestedSelector = createSelector(
  selectGlobal,
  (state) => state.get('requested')
);

const readySelector = createSelector(
  selectGlobal,
  (state) => state.get('ready')
);

const entitiesSelector = createSelector(
  selectGlobal,
  (state) => state.get('entities')
);

const usersSelector = createSelector(
  entitiesSelector,
  (entities) => entities.get('users')
);

const entitySelector = (state, { path, id }) =>
  state.getIn(['global', 'entities', path]).get(id);

const haveEntitySelector = (state, { path, id }) =>
  state.getIn(['global', 'entities', path]).has(id);

const entitiesPathSelector = (state, { path }) =>
  state.getIn(['global', 'entities', path]);

const requestedPathSelector = (state, { path }) =>
  state.getIn(['global', 'requested', path]);

const pagingSelector = (_, { perPage, currentPage }) => ({
  perPage,
  currentPage,
});

const sortBySelector = (_, { sortBy, sortOrder }) => ({
  sortBy,
  sortOrder,
});

const readyPathSelector = (state, { path }) =>
  state.getIn(['global', 'ready', path]);

const makeEntitySelector = () => createSelector(
  entitySelector,
  (entity) => entity ? entity.toJS() : null
);

const makeEntityMapSelector = () => createSelector(
  entitySelector,
  (entity) => entity
);
const makeEntityExtendedMapSelector = () => createSelector(
  entitySelector,
  usersSelector,
  (entity, users) => {
    if (entity) {
      const username = users
        ? users.get(entity.get('attributes').get('last_modified_user_id')).get('attributes').get('name')
        : '';
      return entity.setIn(['attributes', 'last_modified_user'],
        entity.get('attributes').get('last_modified_user_id')
          ? username
          : 'System'
      );
    }
    return null;
  }
);

const makeEntitiesReadySelector = () => createSelector(
  readyPathSelector,
  (ready) => !!ready
);

const makeEntitiesRequestedSelector = () => createSelector(
  requestedPathSelector,
  (requested) => !!requested
);

const makeEntitiesListSelector = () => createSelector(
  entitiesPathSelector,
  (entities) => entities.toList()
);

const makeEntitiesArraySelector = () => createSelector(
  makeEntitiesListSelector(),
  (entitiesList) => entitiesList.toJS()
);

const makeEntitisSortedSelector = () => createSelector(
  sortBySelector,
  makeEntitiesArraySelector(),
  ({ sortBy, sortOrder }, entities) => orderBy(entities, getSortIteratee(sortBy), sortOrder)
);

const makeEntitiesPagedSelector = () => createSelector(
  pagingSelector,
  makeEntitisSortedSelector(),
  ({ currentPage, perPage }, entities) => {
    const length = entities.length;
    const totalPages = Math.ceil(Math.max(length, 0) / perPage);
    const pageNum = Math.min(currentPage, totalPages);
    const offset = (pageNum - 1) * perPage;
    const end = offset + perPage;
    const haveNextPage = end < entities.length;
    const havePrevPage = pageNum > 1;
    const page = slice(entities, offset, end);
    return {
      page,
      havePrevPage,
      haveNextPage,
      totalPages,
      currentPage,
      perPage,
    };
  }
);

export {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocationState,
  makeSelectEmail,
  makeSelectPassword,
  makeSelectSignedIn,
  makeSelectAuth,
  makeSelectNextPathname,
  entitiesSelector,
  entitySelector,
  entitiesPathSelector,
  requestedSelector,
  readySelector,
  haveEntitySelector,
  makeEntitySelector,
  makeEntitiesReadySelector,
  makeEntitiesRequestedSelector,
  makeEntityMapSelector,
  makeEntityExtendedMapSelector,
  makeEntitiesListSelector,
  makeEntitiesArraySelector,
  makeEntitiesPagedSelector,
};

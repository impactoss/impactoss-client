/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { slice } from 'lodash/array';
import { orderBy, reduce } from 'lodash/collection';
import createCachedSelector from 're-reselect';

// import createCachedSelector from 'utils/createCachedSelector';
import { getEntitySortIteratee } from 'utils/sort';

const selectGlobal = (state) => state.get('global');
const selectGlobalEntities = (state) => state.getIn(['global', 'entities']);
const selectRoute = (state) => state.get('route');


/**
* Use `createCachedSelector` when you want to make a selector that takes arguments
* https://github.com/reactjs/reselect/issues/184 ( problem )
* https://github.com/toomuchdesign/re-reselect ( solution )
*
* use the makeSelector () => createSelector pattern when you want a selector that
* doesn't take arguments, but can have its own cache between components
*
* otherwise use straight createSelector
* https://github.com/react-boilerplate/react-boilerplate/pull/1205#issuecomment-274319934
*
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

const entitiesPathSelector = createSelector(
  selectGlobalEntities,
  (state, { path }) => path,
  (entities, path) => entities.get(path)
);

const entityPathSelector = createSelector(
  entitiesPathSelector,
  (state, { id }) => id,
  (entities, id) => entities.get(id)
);

const haveEntitySelector = createSelector(
  entitiesPathSelector,
  (state, { id }) => id,
  (entities, id) => entities.has(id)
);

const readyPathSelector = createSelector(
  readySelector,
  (state, { path }) => path,
  (ready, path) => ready.get(path)
);

const entitiesReadySelector = createCachedSelector(
  readyPathSelector,
  (ready) => !!ready
)((state, { path }) => path);


const entitiesSortedSelector = createCachedSelector(
  entitiesPathSelector,
  (state, { sortBy }) => sortBy,
  (state, { sortOrder }) => sortOrder,
  (entities, sortBy, sortOrder) => { // eslint-disable-line
    // console.log('no cache for ', sortBy, sortOrder); // eslint-disable-line
    return orderBy(entities.toList().toJS(), getEntitySortIteratee(sortBy), sortOrder);
  }
)((state, { path, sortBy, sortOrder }) => {
  const entities = entitiesPathSelector(state, { path });
  return `${entities.hashCode()}:${sortBy}:${sortOrder}`;
});

const entitiesPagedSelector = createCachedSelector(
  entitiesSortedSelector,
  (state, { currentPage }) => currentPage,
  (state, { perPage }) => perPage,
  (entities, currentPage, perPage) => {
    const length = entities.length;
    const totalPages = Math.ceil(Math.max(length, 0) / perPage);
    const pageNum = Math.min(currentPage, totalPages);
    const offset = (pageNum - 1) * perPage;
    const end = offset + perPage;
    const haveNextPage = end < entities.length;
    const havePrevPage = pageNum > 1;
    const page = slice(entities, offset, end);
    // console.log('no cache for offset', offset);
    return {
      page,
      havePrevPage,
      haveNextPage,
      totalPages,
      currentPage,
      perPage,
    };
  }
)((state, { path, currentPage, perPage }) => {
  const entities = entitiesPathSelector(state, { path });
  return `${entities.hashCode()}:${currentPage}:${perPage}`;
});

const entitiesSelectWhere = createCachedSelector(
  entitiesPathSelector,
  (state, { where }) => where ? JSON.stringify(where) : null,
  (entities, where) => // console.log("entitiesSelectWhere: " + where)
    entities && where ? entities.filter((entity) =>
      reduce(JSON.parse(where), (result, value, key) => {
        if (key === 'id') {
          return entity.get('id') === value.toString();
        }
        return entity.getIn(['attributes', key]) && entity.getIn(['attributes', key]).toString() === value.toString();
      }, true)
    ) : entities
)((state, { path, where, out }) => `${path}:${JSON.stringify(where)}:${out}`);


const entitiesSelect = createSelector(
  (state) => state,
  entitiesSelectWhere,
  (state, args) => args,
  (state, entities, args) => {
    // not to worry about caching here as "inexpensive"
    // console.log('entitiesSelect: ' + JSON.stringify(args))
    let result = entities;
    if (args.extend) {
      result = entities.map((entity) => {
        const where = args.extend.where || {};
        let extended;
        where[args.extend.on] = entity.get('id');
        // recursive call
        extended = entitiesSelect(state, {
          path: args.extend.path,
          where,
          extend: args.extend.extend,
        });
        if (args.extend.type === 'count') {
          extended = extended.size;
        }
        return entity.set(args.extend.as || args.extend.path, extended);
      });
    }
    return result && args.out === 'js' ? result.toJS() : result;
  }
);

const entitySelect = createSelector(
  (state) => state,
  entityPathSelector,
  (state, args) => args,
  (state, entity, args) => {
    // console.log('entitySelect: ' + JSON.stringify(args))
    let result = entity;
    if (entity && args.extend) {
      const argsExtended = {
        path: args.extend.path,
      };
      let extended;

      if (args.extend.type === 'id') {
        if (args.extend.reverse) {
          argsExtended.id = entity.getIn(['attributes', args.extend.on]);
        } else {
          argsExtended.where = {};
          argsExtended.where[args.extend.on] = entity.get('id');
        }
        extended = entitySelect(state, argsExtended);
      } else {
        argsExtended.where = {};
        if (args.extend.reverse) {
          argsExtended.where.id = entity.getIn(['attributes', args.extend.on]);
        } else {
          argsExtended.where[args.extend.on] = entity.get('id');
        }
        extended = entitiesSelect(state, argsExtended);
        if (args.extend.type === 'count') {
          extended = extended.size;
        }
      }
      result = result.set(args.extend.as || args.extend.path, extended);
    }
    return result && args.out === 'js' ? result.toJS() : result;
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
  requestedSelector,
  readySelector,
  haveEntitySelector,
  entitiesReadySelector,
  entitiesPagedSelector,
  entitiesSortedSelector,
  entitiesSelect,
  entitySelect,
};

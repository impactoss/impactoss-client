/**
 * The global state selectors
 *
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

import { createSelector } from 'reselect';
import { slice } from 'lodash/array';
import { orderBy, reduce } from 'lodash/collection';
import createCachedSelector from 're-reselect';

import { getEntitySortIteratee } from 'utils/sort';

// high level state selects
const getRoute = (state) => state.get('route');
const getGlobal = (state) => state.get('global');
const getGlobalEntities = (state) => state.getIn(['global', 'entities']);
const getGlobalRequested = (state) => state.getIn(['global', 'requested']);
const getGlobalReady = (state) => state.getIn(['global', 'ready']);


const makeSelectLoading = () => createSelector(
  getGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  getGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectAuth = () => createSelector(
  getGlobal,
  (globalState) => globalState.get('auth').toJS()
);

const makeSelectSignedIn = () => createSelector(
  getGlobal,
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
  getGlobal,
  (globalState) => globalState.getIn(['form', 'login', 'email'])
);

const makeSelectPassword = () => createSelector(
  getGlobal,
  (globalState) => globalState.getIn(['form', 'login', 'password'])
);

const makeSelectNextPathname = () => createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'state', 'nextPathname']);
    } catch (error) {
      return null;
    }
  }
);


const getRequestedAt = createSelector(
  getGlobalRequested,
  (state, { path }) => path,
  (requested, path) => requested.get(path)
);

const getReady = createSelector(
  getGlobalReady,
  (state, { path }) => path,
  (ready, path) => ready.get(path)
);

const isReady = createSelector(
  getReady,
  (ready) => !!ready
);

const getEntitiesPure = createSelector(
  getGlobalEntities,
  (state, { path }) => path,
  (entities, path) => entities.get(path)
);

const getEntitiesJoint = createSelector(
  (state) => state,
  getEntitiesPure,
  (state, { join }) => join,
  (state, entities, join) => {
    if (join) {
      const where = join.where;
      return entities.filter((entity) => {
        where[join.key] = entity.get('id');
        const joins = getEntitiesWhere(state, {
          path: join.path,
          where,
        });
        return joins && joins.size;
      });
    }
    return entities;
  }
);


const getEntitiesWhere = createCachedSelector(
  getEntitiesJoint,
  (state, { where }) => where ? JSON.stringify(where) : null, // enable caching
  (entities, whereString) => {
    if (whereString) {
      const where = JSON.parse(whereString);
      return entities.filter((entity) =>
        reduce(where, (result, value, key) => {
          if (key === 'id') {
            return entity.get('id') === value.toString();
          }
          return entity.getIn(['attributes', key]) && entity.getIn(['attributes', key]).toString() === value.toString();
        }, true)
      );
    }
    return entities;
  }
)((state, { path, where }) => `${path}:${JSON.stringify(where)}`);


const getEntities = createSelector(
  (state) => state,
  getEntitiesWhere,
  (state, { out }) => out,
  (state, { extend }) => extend,
  (state, entities, out, extend) => {
    // not to worry about caching here as "inexpensive"
    let result;
    if (extend) {
      result = entities.map((entity) =>
        extendEntity(state, entity, extend)
      );
    } else {
      result = entities;
    }
    return out === 'js' ? result.toJS() : result;
  }
);
// helper
const extendEntity = (state, entity, args) => {
  const extend = {
    path: args.path, // the table to look up, required
    key: args.key, // the foreign key
    type: args.type || 'list', // one of: list, count, single
    as: args.as || args.path, // the attribute to store
    reverse: args.reverse || false, // reverse relation
    via: args.via || null, // the associative table, many:many relationship
    where: args.where || {}, // conditions for join
    extend: args.extend || null,
    join: args.join || null,
  };
  if (extend.reverse) {
    // reverse: other entity pointing to entity
    extend.where[extend.key] = entity.get('id');
  } else if (extend.type === 'single') {
    extend.id = entity.getIn(['attributes', extend.key]);
  } else {
    extend.where.id = entity.getIn(['attributes', extend.key]);
  }

  let extended;
  if (extend.type === 'single') {
    extended = getEntity(state, extend);
  } else {
    extended = getEntities(state, extend);

    if (extended && extend.type === 'count') {
      extended = extended.size;
    }
  }
  // console.log(extend)
  // console.log(extended.toJS())
  return entity.set(extend.as, extended);
};

const getEntitiesSorted = createCachedSelector(
  getEntities,
  (state, { sortBy }) => sortBy || 'id',
  (state, { sortOrder }) => sortOrder || 'desc',
  (entities, sortBy, sortOrder) => { // eslint-disable-line
    // console.log('no cache for ', sortBy, sortOrder); // eslint-disable-line
    return orderBy(entities.toList().toJS(), getEntitySortIteratee(sortBy), sortOrder);
  }
)((state, { path, sortBy, sortOrder }) => {
  const entities = getEntitiesPure(state, { path });
  return `${entities.hashCode()}:${sortBy}:${sortOrder}`;
});

const getEntitiesPaged = createCachedSelector(
  getEntitiesSorted,
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
  const entities = getEntitiesPure(state, { path });
  return `${entities.hashCode()}:${currentPage}:${perPage}`;
});


const getEntityPure = createSelector(
  getEntitiesPure,
  (state, { id }) => id,
  (entities, id) => entities.get(id)
);

const hasEntity = createSelector(
  getEntitiesPure,
  (state, { id }) => id,
  (entities, id) => entities.has(id)
);

const getEntity = createSelector(
  (state) => state,
  getEntityPure,
  (state, { out }) => out,
  (state, { extend }) => extend,
  (state, entity, out, extend) => {
    // console.log('entitySelect: ' + JSON.stringify(args))
    let result;
    if (entity && extend) {
      result = extendEntity(state, entity, extend);
    } else {
      result = entity;
    }
    return result && out === 'js' ? result.toJS() : result;
  }
);


export {
  getGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocationState,
  makeSelectEmail,
  makeSelectPassword,
  makeSelectSignedIn,
  makeSelectAuth,
  makeSelectNextPathname,
  getRequestedAt,
  getReady,
  isReady,
  getEntitiesWhere,
  getEntities,
  getEntitiesSorted,
  getEntitiesPaged,
  hasEntity,
  getEntity,
};

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

const getCurrentUser = createSelector(
  getGlobal,
  (globalState) => globalState.get('user')
);

const getCurrentUserId = createSelector(
  getCurrentUser,
  (user) => user && user.attributes && user.getIn(['attributes', 'id']).toString()
);

const isSignedIn = createSelector(
  getCurrentUser,
  (currentUser) => currentUser.get('isSignedIn')
);

const makeSelectSignedIn = () => isSignedIn;
const makeSelectCurrentUserId = () => getCurrentUserId;

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

const isReady = (state, { path }) =>
  reduce(Array.isArray(path) ? path : [path],
    (areReady, readyPath) => areReady && !!state.getIn(['global', 'ready', readyPath]),
    true
  );

const getEntitiesPure = createSelector(
  getGlobalEntities,
  (state, { path }) => path,
  (entities, path) => entities.get(path)
);

const getUsersPure = createSelector(
  getGlobalEntities,
  (entities) => entities.get('users')
);

// check if entities are not connected to any other entities via associative table
const getEntitiesWithout = createSelector(
  (state) => state,
  getEntitiesPure,
  (state, { without }) => without,
  (state, entities, without) => without
    ? entities.filter((entity) =>
      reduce(Array.isArray(without) ? without : [without], (passing, withoutCond) => {
        const where = {};
        where[withoutCond.key] = entity.get('id');
        // taxonomy
        if (withoutCond.taxonomyId) {
          // get all associations for entity and store category count for given taxonomy
          const associations = getEntities(state, {
            path: withoutCond.connectedPath, // measure_categories
            where, // {measure_id : 3}
            extend: {
              path: 'categories',
              as: 'count',
              key: 'category_id',
              type: 'count',
              where: {
                taxonomy_id: withoutCond.taxonomyId,
              },
            },
          });
          // check if any category present (count > 0)
          return !associations.reduce((hasCategories, association) =>
            hasCategories || association.get('count') > 0, false
          );
        }
        const joins = getEntitiesWhere(state, {
          path: withoutCond.connectedPath, // recommendation_measures
          where, // {measure_id : 3}
        });
        return !(joins && joins.size); // !not associated
      }, true)
    )
    : entities
);

// check if entities have connections with other entities via associative table
const getEntitiesJoint = createSelector(
  (state) => state,
  getEntitiesWithout,
  (state, { join }) => join,
  (state, entities, join) => join
    ? entities.filter((entity) =>
      reduce(Array.isArray(join) ? join : [join], (passing, joinWhere) => joinWhere.where // allows multiple joins
        ? reduce(Array.isArray(joinWhere.where) ? joinWhere.where : [joinWhere.where], (passingWhere, where) => { // and multiple wheres
          const w = where;
          w[joinWhere.key] = entity.get('id');
          const joins = getEntitiesWhere(state, {
            path: joinWhere.path, // path of associative table
            where: w,
          });
          return joins && joins.size; // assication present
        }, true)
        : true, true)
      )
    : entities
);

// check entity attributes or id
const getEntitiesWhere = createCachedSelector(
  getEntitiesJoint,
  (state, { where }) => where ? JSON.stringify(where) : null, // enable caching
  (entities, whereString) => {
    if (whereString) {
      const where = JSON.parse(whereString);
      return entities.filter((entity) =>
        reduce(where, (passing, value, key) => {
          if (key === 'id') {
            return passing && entity.get('id') === value.toString();
          }
          const testValue = entity.getIn(['attributes', key]);
          if (typeof testValue === 'undefined') {
            return false;
          }
          return passing && testValue.toString() === value.toString();
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
const extendEntity = (state, entity, extendArgs) => {
  const argsArray = Array.isArray(extendArgs) ? extendArgs : [extendArgs];
  let result = entity;
  argsArray.forEach((args) => {
    const extend = {
      path: args.path, // the table to look up, required
      key: args.key, // the foreign key
      type: args.type || 'list', // one of: list, count, single
      as: args.as || args.path, // the attribute to store
      reverse: args.reverse || false, // reverse relation
      where: args.where || {}, // conditions for join
      extend: args.extend || null,
      join: args.join || null,
    };
    if (extend.reverse) {
      // reverse: other entity pointing to entity
      extend.where[extend.key] = entity.get('id');
    } else {
      // entity pointing to other entity
      const key = entity.getIn(['attributes', extend.key]);
      extend.where.id = key && key.toString();
    }

    let extended;
    if (extend.type === 'single') {
      extend.id = extend.where.id; // getEntityPure selector requires id
      extended = getEntity(state, extend);
    } else {
      extended = getEntities(state, extend);
      if (extended && extend.type === 'count') {
        extended = extended.size;
      }
    }
    result = result.set(extend.as, extended && extended.size === 0 ? null : extended);
  });
  return result;
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
      entities: page,
      total: entities.length,
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
  (state, { id }) => id && id.toString(),
  (entities, id) => entities.get(id)
);

const getUserPure = createSelector(
  getUsersPure,
  (state, { id }) => id && id.toString(),
  (users, id) => users.get(id)
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

const getUser = createSelector(
  (state) => state,
  getUserPure,
  (state, { out }) => out,
  (state, user, out) => {
    const result = user || getCurrentUser(state);
    return result && out === 'js' ? result.toJS() : result;
  }
);


export {
  getGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocationState,
  makeSelectSignedIn,
  makeSelectAuth,
  makeSelectNextPathname,
  getRequestedAt,
  isReady,
  getEntitiesWhere,
  getEntities,
  getEntitiesSorted,
  getEntitiesPaged,
  hasEntity,
  getEntity,
  getUser,
  getCurrentUser,
  isSignedIn,
  makeSelectCurrentUserId,
  getCurrentUserId,
};

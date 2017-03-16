/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { slice } from 'lodash/array';
import { orderBy } from 'lodash/collection';
import createCachedSelector from 're-reselect';
// import createCachedSelector from 'utils/createCachedSelector';
import { getEntitySortIteratee } from 'utils/sort';

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

// TAXONOMY QUERIES
const taxonomiesSelector = (state) => state.getIn(['global', 'entities', 'taxonomies']);

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

const usersSelector = (state) =>
  state.getIn(['global', 'entities', 'users']);

const entitySelector = (state, { path, id }) =>
  state.getIn(['global', 'entities', path]).get(id);

const haveEntitySelector = (state, { path, id }) =>
  state.getIn(['global', 'entities', path]).has(id);

const entitiesPathSelector = (state, { path }) =>
  state.getIn(['global', 'entities', path]);

const readyPathSelector = (state, { path }) =>
  state.getIn(['global', 'ready', path]);

const entityJSSelector = createCachedSelector(
  entitySelector,
  (entity) => entity ? entity.toJS() : null
)((state, { path, id }) => `${path}:${id}`);

const userById = (users, id) => users && id && users.get(id);

const argsToJsSelector = (state, { toJS }) => toJS;

const extendEntityUserName = (entity, user) =>
  entity &&
  entity.setIn(['attributes', 'last_modified_user'], user ? user.get('attributes').get('name') : 'System');

const entityExtendedSelector = createCachedSelector(
  entitySelector,
  usersSelector,
  argsToJsSelector,
  (entity, users, toJS) => {
    if (entity && users) {
      const user = userById(users, entity.get('attributes').get('last_modified_user_id'));
      const entityExtended = extendEntityUserName(entity, user);
      return entityExtended && toJS ? entityExtended.toJS() : entityExtended;
    }
    return null;
  }
)((state, { id, path, toJS }) => `${id}:${path}:${toJS}}`);

const entitiesReadySelector = createCachedSelector(
  readyPathSelector,
  (ready) => !!ready
)((state, { path }) => path);

const entitiesSelector = createCachedSelector(
  entitiesPathSelector,
  argsToJsSelector,
  (entities, toJS) => entities && toJS ? entities.toJS() : entities
)((state, { path, toJS }) => `${path}:${toJS}`);

const sortBySelector = (state, { sortBy }) => sortBy;
const sortOrderSelector = (state, { sortOrder }) => sortOrder;

const entitiesSortedSelector = createCachedSelector(
  entitiesPathSelector,
  sortBySelector,
  sortOrderSelector,
  (entities, sortBy, sortOrder) => { // eslint-disable-line
    // console.log('no cache for ', sortBy, sortOrder); // eslint-disable-line
    return orderBy(entities.toList().toJS(), getEntitySortIteratee(sortBy), sortOrder);
  }
)((state, { path, sortBy, sortOrder }) => {
  const entities = entitiesPathSelector(state, { path });
  return `${entities.hashCode()}:${sortBy}:${sortOrder}`;
});

const perPageSelector = (state, { currentPage }) => currentPage;
const currentPageSelector = (state, { perPage }) => perPage;

const entitiesPagedSelector = createCachedSelector(
  entitiesSortedSelector,
  perPageSelector,
  currentPageSelector,
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

const argsTypeSelector = (state, { type }) => type;

const taxonomiesByTypeSelector = createCachedSelector(
  taxonomiesSelector,
  argsTypeSelector,
  argsToJsSelector,
  (taxonomies, type, toJS) => {
    const taxonomiesByType = taxonomies.filter((taxonomy) =>
      taxonomy.get('attributes').get(`tags_${type === 'actions' ? 'measures' : type}`));
    return taxonomiesByType && toJS ? taxonomiesByType.toJS() : taxonomiesByType;
  }
)((state, { type, toJS }) => `${type}:${toJS}`);

// CATEGORY QUERIES
const categoriesSelector = (state) => state.getIn(['global', 'entities', 'categories']);
const actionCategoriesSelector = (state) => state.getIn(['global', 'entities', 'action_categories']);

const argsEntityIdSelector = (state, { id }) => id;

const categoryByTaxonomyIdSelector = createSelector(
  categoriesSelector,
  argsEntityIdSelector,
  (categories, taxId) => categories.filter((cat) => cat.getIn(['attributes', 'taxonomy_id']) === parseInt(taxId, 10))
);

const argsActionIdSelector = (state, { actionId }) => actionId;
const argsCategoryIdSelector = (state, { categoryId }) => categoryId;

const assignedActionCategorySelector = createCachedSelector(
  actionCategoriesSelector,
  argsActionIdSelector,
  argsCategoryIdSelector,
  (actionCategories, actionId, categoryId) =>
    actionCategories.find((ac) =>
      ac.getIn(['attributes', 'measure_id']) === actionId && ac.getIn(['attributes', 'category_id']) === categoryId)
)((state, { categoryId, actionId }) => `${categoryId}:${actionId}`);

const taxonomiesByTypeExtendedSelector = createCachedSelector(
  (state) => state, // pass through so we can use raw state with other selectors
  argsActionIdSelector,
  argsTypeSelector,
  argsToJsSelector,
  (state, actionId, type, toJS) => {
    const taxonomiesByType = taxonomiesByTypeSelector(state, { type });

    const categoriesByTaxonomyType = taxonomiesByType.map((tax) => {
      const categoriesByTaxonomyId = categoryByTaxonomyIdSelector(state, { id: tax.get('id') });

      const categories = categoriesByTaxonomyId.map((cat) => {
        const assigned = assignedActionCategorySelector(state, { actionId, categoryId: cat.get('id') });
        return cat.set('assigned', !!assigned && assigned.length);
      });

      return tax.set('categories', categories);
    });
    return categoriesByTaxonomyType && toJS ? categoriesByTaxonomyType.toJS() : categoriesByTaxonomyType;
  }
)((state, { actionId, type, toJS }) => `${actionId}:${type}:${toJS}`);

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
  taxonomiesByTypeSelector,
  taxonomiesByTypeExtendedSelector,
  entityJSSelector,
  entitiesReadySelector,
  entityExtendedSelector,
  entitiesPagedSelector,
  entitiesSortedSelector,
};

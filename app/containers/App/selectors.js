/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

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

const makeEntitiesSelector = () => createSelector(
  entitiesPathSelector,
  argsSelector,
  (entities, { toJS }) => entities && toJS ? entities.toJS() : entities
);

const makeEntitiesArraySelector = () => createSelector(
  makeEntitiesListSelector(),
  (entitiesList) => entitiesList.toJS()
);

// GENERIC ARGS QUERY
const argsSelector = (state, args) => args;

// TAXONOMY QUERIES
const taxonomiesSelector = (state) => state.getIn(['global', 'entities', 'taxonomies']);

const taxonomyByType = (taxonomies, type) =>
  taxonomies && type && taxonomies.filter((taxonomy) =>
    taxonomy.get('attributes').get(`tags_${type === 'actions' ? 'measures' : type}`));

const makeTaxonomyByTypeSelector = () => createSelector(
  taxonomiesSelector,
  argsSelector,
  (taxonomies, { type, toJS }) => {
    const taxonomiesByType = taxonomyByType(taxonomies, type);
    return taxonomiesByType && toJS ? taxonomiesByType.toJS() : taxonomiesByType;
  }
);

// CATEGORY QUERIES
const categoriesSelector = (state) => state.getIn(['global', 'entities', 'categories']);

const categoryByTaxonomyId = (categories, taxId) =>
  categories && taxId && categories.filter((cat) =>
    cat.get('attributes').get('taxonomy_id') === parseInt(taxId, 10));

const makeCategoryByTaxonomyTypeSelector = () => createSelector(
  taxonomiesSelector,
  categoriesSelector,
  argsSelector,
  (taxonomies, categories, { type, toJS }) => {
    const taxonomiesByType = taxonomyByType(taxonomies, type);
    const categoriesByTaxonomyType = taxonomiesByType && taxonomiesByType.map((tax) =>
      categoryByTaxonomyId(categories, tax.get('id'))
    );
    return categoriesByTaxonomyType && toJS ? categoriesByTaxonomyType.toJS() : categoriesByTaxonomyType;
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
  makeTaxonomyByTypeSelector,
  makeCategoryByTaxonomyTypeSelector,
  makeEntitiesSelector,
};

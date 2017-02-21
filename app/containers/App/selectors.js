/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import _ from 'lodash/function'

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

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

const makeSelectEntities = (path) => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entities', path])
);

const makeSelectActions = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entities', 'actions'])
);

const makeSelectRecommendations = createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entities', 'recommendations'])
);

const makeSelectRecommendationActions = createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entities', 'recommendation_actions'])
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

const entitiesSelector = createSelector(
  selectGlobal,
  (globalState) => globalState.get('entities')
);

const entitiesPathSelector = createSelector(
  entitiesSelector,
  (entities) => _.memoize(
    (path) => entities.get(path)
  )
);

export {
  selectGlobal,
  makeSelectLoading,
  makeSelectError,
  makeSelectEntities,
  makeSelectLocationState,
  makeSelectEmail,
  makeSelectPassword,
  makeSelectSignedIn,
  makeSelectAuth,
  makeSelectNextPathname,
  makeSelectActions,
  makeSelectRecommendations,
  makeSelectRecommendationActions,
  entitiesSelector,
  entitiesPathSelector,
};

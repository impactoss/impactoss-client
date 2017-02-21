/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { memoize } from 'lodash/function';

const selectGlobal = (state) => state.get('global');
const selectRoute = (state) => state.get('route');

/**
* NOTE TODO These shouldn't actually be MakeSelect...,
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

/*
 Pretty sure this won't cache correclty so have removed, see
 entitiesPathSelector for an alternative
const makeSelectEntities = (path) => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['entities', path])
);
*/

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
  (entities) => memoize(
    (path) => entities.get(path)
  )
);

const actionsSelector = createSelector(
  entitiesSelector,
  (entities) => entities.get('actions')
);

const actionsListSelector = createSelector(
  actionsSelector,
  (actions) => actions.toIndexedSeq().toJS()
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
  makeSelectRecommendations,
  makeSelectRecommendationActions,
  entitiesSelector,
  entitiesPathSelector,
  actionsSelector,
  actionsListSelector,
};

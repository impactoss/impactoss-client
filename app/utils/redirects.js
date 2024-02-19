import { USER_ROLES, ENABLE_AZURE } from 'themes/config';
import { ROUTES, PARAMS } from 'containers/App/constants';
import {
  selectIsSignedIn,
  selectSessionUserRoles,
  selectReadyForAuthCheck,
} from 'containers/App/selectors';

import checkStore from './checkStore';

export function replaceIfNotSignedIn(redirectOnAuthSuccess, replace, info = PARAMS.NOT_SIGNED_IN, replacePath) {
  return replacePath
    ? replace(replacePath)
    : replace({ pathname: ROUTES.LOGIN, query: { redirectOnAuthSuccess, info } });
}

export function replaceUnauthorised(replace, replacePath) {
  return replace(replacePath || ROUTES.UNAUTHORISED);
}

export function replaceAlreadySignedIn(replace, info = PARAMS.ALREADY_SIGNED_IN) {
  return replace({ pathname: '/', query: { info } });
}

export function hasRoleRequired(roleIds, roleRequired) {
  return roleIds.includes(roleRequired)
  || (roleRequired === USER_ROLES.MANAGER.value && roleIds.includes(USER_ROLES.ADMIN.value))
  || (roleRequired === USER_ROLES.CONTRIBUTOR.value && (roleIds.includes(USER_ROLES.MANAGER.value) || roleIds.includes(USER_ROLES.ADMIN.value)));
}

function redirectIfSignedIn(store) {
  return (nextState, replace) => selectIsSignedIn(store.getState()) && replaceAlreadySignedIn(replace);
}
function redirectIfAzureEnabled() {
  return (nextState, replace) => ENABLE_AZURE && replace({ pathname: '/' });
}

function redirectIfNotSignedIn(store, info = PARAMS.NOT_SIGNED_IN) {
  return (nextState, replace) => {
    if (!selectIsSignedIn(store.getState())) {
      replaceIfNotSignedIn(nextState.location.pathname, replace, info);
    }
  };
}

function redirectIfNotPermitted(store, roleRequired, replacePath) {
  return (nextState, replace) => {
    if (!selectIsSignedIn(store.getState())) {
      replaceIfNotSignedIn(nextState.location.pathname, replace, PARAMS.NOT_SIGNED_IN, replacePath);
    } else if (selectReadyForAuthCheck(store.getState()) && !hasRoleRequired(selectSessionUserRoles(store.getState()), roleRequired)) {
      replaceUnauthorised(replace, replacePath);
    }
  };
}

/**
 * Helper for creating redirects
 */
export function getRedirects(store) {
  checkStore(store);

  return {
    redirectIfSignedIn: (info) => redirectIfSignedIn(store, info),
    redirectIfAzureEnabled: () => redirectIfAzureEnabled(),
    redirectIfNotSignedIn: (info) => redirectIfNotSignedIn(store, info),
    redirectIfNotPermitted: (roleRequired, replacePath) => redirectIfNotPermitted(store, roleRequired, replacePath),
  };
}

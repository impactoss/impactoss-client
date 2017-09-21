import { USER_ROLES } from 'containers/App/constants';
import {
  selectIsSignedIn,
  selectSessionUserRoles,
  selectReadyForAuthCheck,
} from 'containers/App/selectors';

import checkStore from './checkStore';

export function replaceIfNotSignedIn(redirectOnAuthSuccess, replace, info = 'notSignedIn') {
  return replace({ pathname: '/login', query: { redirectOnAuthSuccess, info } });
}

export function replaceUnauthorised(replace) {
  return replace('/unauthorised');
}

export function replaceAlreadySignedIn(replace, info = 'alreadySignedIn') {
  return replace({ pathname: '/', query: { info } });
}

export function hasRoleRequired(roleIds, roleRequired) {
  return roleIds.includes(roleRequired)
  || (roleRequired === USER_ROLES.MANAGER && roleIds.includes(USER_ROLES.ADMIN))
  || (roleRequired === USER_ROLES.CONTRIBUTOR && (roleIds.includes(USER_ROLES.MANAGER) || roleIds.includes(USER_ROLES.ADMIN)));
}

function redirectIfSignedIn(store) {
  return (nextState, replace) =>
    selectIsSignedIn(store.getState()) && replaceAlreadySignedIn(replace);
}

function redirectIfNotSignedIn(store, info = 'notSignedIn') {
  return (nextState, replace) => {
    if (!selectIsSignedIn(store.getState())) {
      replaceIfNotSignedIn(nextState.location.pathname, replace, info);
    }
  };
}

function redirectIfNotPermitted(store, roleRequired) {
  return (nextState, replace) => {
    if (!selectIsSignedIn(store.getState())) {
      replaceIfNotSignedIn(nextState.location.pathname, replace);
    } else if (selectReadyForAuthCheck(store.getState()) && !hasRoleRequired(selectSessionUserRoles(store.getState()), roleRequired)) {
      replaceUnauthorised(replace);
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
    redirectIfNotSignedIn: (info) => redirectIfNotSignedIn(store, info),
    redirectIfNotPermitted: (roleRequired) => redirectIfNotPermitted(store, roleRequired),
  };
}

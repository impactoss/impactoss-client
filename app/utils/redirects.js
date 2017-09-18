import { USER_ROLES } from 'containers/App/constants';

import checkStore from './checkStore';

export function replaceIfNotSignedIn(pathname, replace, info = 'notSignedIn') {
  return replace({
    pathname: '/login',
    query: {
      redirectOnAuthSuccess: pathname,
      info,
    },
  });
}

export function replaceUnauthorised(replace) {
  return replace('/unauthorised');
}

export function isSignedIn(store) {
  return store.getState().getIn(['global', 'user', 'isSignedIn']);
}

function getUserRoleIds(store) {
  const userId = store.getState().getIn(['global', 'user', 'attributes']).id;
  return store.getState().getIn(['global', 'entities', 'user_roles'])
    .filter((userRole) =>
      userRole.getIn(['attributes', 'user_id']) === userId
    )
    .map((role) => role.getIn(['attributes', 'role_id']));
}

export function hasRoleRequired(roleIds, roleRequired) {
  return roleIds.includes(roleRequired)
  || (roleRequired === USER_ROLES.MANAGER && roleIds.includes(USER_ROLES.ADMIN))
  || (roleRequired === USER_ROLES.CONTRIBUTOR && (roleIds.includes(USER_ROLES.MANAGER) || roleIds.includes(USER_ROLES.ADMIN)));
}

function redirectIfSignedIn(store) {
  return (nextState, replace) => {
    if (store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/',
        query: {
          info: 'alreadySignedIn',
        },
      });
    }
  };
}

function redirectIfNotSignedIn(store, info = 'notSignedIn') {
  return (nextState, replace) => !isSignedIn(store) && replaceIfNotSignedIn(nextState.location.pathname, replace, info);
}

function redirectIfNotPermitted(store, roleRequired) {
  return (nextState, replace) => {
    if (!isSignedIn(store)) {
      replaceIfNotSignedIn(nextState.location.pathname, replace);
    } else if (store.getState().getIn(['global', 'user', 'attributes'])) {
      if (!hasRoleRequired(getUserRoleIds(store), roleRequired)) {
        replaceUnauthorised(replace);
      }
    }
  };
}

/**
 * Helper for creating redirects
 */
export function getRedirects(store) {
  checkStore(store);

  return {
    redirectIfSignedIn: redirectIfSignedIn(store),
    redirectIfNotSignedIn: redirectIfNotSignedIn(store),
    redirectIfNotPermitted: (role) => redirectIfNotPermitted(store, role),
  };
}

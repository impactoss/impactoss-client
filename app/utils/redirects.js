import { USER_ROLES } from 'containers/App/constants';

import checkStore from './checkStore';

function redirectIfNotSignedIn(store) {
  return (nextState, replace) => {
    if (!store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/login',
        pathnameOnAuthChange: nextState.location.pathname,
      });
    }
  };
}

function redirectIfSignedIn(store) {
  return (nextState, replace) => {
    if (store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/',
      });
    }
  };
}

function redirectIfNotPermitted(store, roleRequired) {
  return (nextState, replace) => {
    if (!store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/login',
        pathnameOnAuthChange: nextState.location.pathname,
      });
    } else if (store.getState().getIn(['global', 'user', 'attributes'])) {
      const userId = store.getState().getIn(['global', 'user', 'attributes']).id;
      const roleIds = store.getState().getIn(['global', 'entities', 'user_roles'])
        .filter((userRole) =>
          userRole.getIn(['attributes', 'user_id']) === userId
        )
        .map((role) => role.getIn(['attributes', 'role_id']));
      if (!(roleIds.includes(roleRequired)
      || (roleRequired === USER_ROLES.MANAGER && roleIds.includes(USER_ROLES.ADMIN))
      || (roleRequired === USER_ROLES.CONTRIBUTOR && (roleIds.includes(USER_ROLES.MANAGER) || roleIds.includes(USER_ROLES.ADMIN)))
      )) {
        replace({
          pathname: '/login',
        });
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
    redirectIfNotPermitted: (role) => redirectIfNotPermitted(store, role),
    redirectIfNotSignedIn: redirectIfNotSignedIn(store),
    redirectIfSignedIn: redirectIfSignedIn(store),
  };
}

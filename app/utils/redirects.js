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
      const roles = store.getState().getIn(['global', 'entities', 'user_roles']).filter((userRole) =>
        userRole.getIn(['attributes', 'user_id']) === userId
      ).toJS();
      const roleIds = roles ? Object.values(roles).map((role) => role.attributes.role_id) : [];
      if (!(roleIds.indexOf(roleRequired) > -1
      || (roleRequired === USER_ROLES.MANAGER && roleIds.indexOf(USER_ROLES.ADMIN) > -1)
      || (roleRequired === USER_ROLES.CONTRIBUTOR && (roleIds.indexOf(USER_ROLES.MANAGER) > -1 || roleIds.indexOf(USER_ROLES.ADMIN) > -1))
      )) {
        replace({
          pathname: '/notfound',
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

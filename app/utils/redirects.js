import checkStore from './checkStore';

function redirectIfNotPermitted(store) {
  return (nextState, replace) => {
    if (!store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/login',
        pathnameOnAuthChange: nextState.location.pathname,
      });
    }
  };
}
function redirectIfLoggedIn(store) {
  return (nextState, replace) => {
    if (store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/',
      });
    }
  };
}

/**
 * Helper for creating redirects
 */
export function getRedirects(store) {
  checkStore(store);

  return {
    redirectIfNotPermitted: redirectIfNotPermitted(store),
    redirectIfLoggedIn: redirectIfLoggedIn(store),
  };
}

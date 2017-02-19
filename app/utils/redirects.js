import checkStore from './checkStore';

function redirectToLoginIfNeeded(store) {
  return (nextState, replace) => {
    if (!store.getState().getIn(['global', 'user', 'isSignedIn'])) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };
}
function redirectToHomeIfSignedIn(store) {
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
    redirectToLoginIfNeeded: redirectToLoginIfNeeded(store),
    redirectToHomeIfSignedIn: redirectToHomeIfSignedIn(store),
  };
}

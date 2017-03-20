// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { getRedirects } from 'utils/redirects';


const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const { redirectToLoginIfNeeded, redirectToHomeIfSignedIn } = getRedirects(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/logout',
      name: 'logout',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/LogoutPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/login',
      name: 'loginPage',
      onEnter: redirectToHomeIfSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/LoginPage/reducer'),
          import('containers/LoginPage/sagas'),
          import('containers/LoginPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('loginPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/register',
      name: 'registerUserPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RegisterUserPage/reducer'),
          import('containers/RegisterUserPage/sagas'),
          import('containers/RegisterUserPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('registerUserPage', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/actions',
      name: 'actionList',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionList/reducer'),
          import('containers/ActionList/sagas'),
          import('containers/ActionList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('actionList', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/actions/new',
      name: 'actionNew',
      onEnter: redirectToLoginIfNeeded,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionNew/reducer'),
          import('containers/ActionNew/sagas'),
          import('containers/ActionNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('actionNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/actions/:id',
      name: 'actionView',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/actions/edit/:id',
      name: 'actionEdit',
      onEnter: redirectToLoginIfNeeded,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionEdit/reducer'),
          import('containers/ActionEdit/sagas'),
          import('containers/ActionEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('actionEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/recommendations',
      name: 'recommendationList',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RecommendationList/reducer'),
          import('containers/RecommendationList/sagas'),
          import('containers/RecommendationList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('recommendationList', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/recommendations/new',
      name: 'recommendationNew',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RecommendationNew/reducer'),
          import('containers/RecommendationNew/sagas'),
          import('containers/RecommendationNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('recommendationNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/recommendations/:id',
      name: 'recommendationView',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RecommendationView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/recommendations/edit/:id',
      name: 'recommendationEdit',
      onEnter: redirectToLoginIfNeeded,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RecommendationEdit/reducer'),
          import('containers/RecommendationEdit/sagas'),
          import('containers/RecommendationEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('recommendationEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/categories',
      name: 'taxonomies',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Taxonomies'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/categories/:id', // the taxonomy id
      name: 'taxonomyCategories',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/TaxonomyCategories'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/categories/:id/new', // the taxonomy id
      name: 'categoryNew',
      onEnter: redirectToLoginIfNeeded,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CategoryNew/reducer'),
          import('containers/CategoryNew/sagas'),
          import('containers/CategoryNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('categoryNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/category/:id',
      name: 'categoryView',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CategoryView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/category/edit/:id',
      name: 'categoryEdit',
      onEnter: redirectToLoginIfNeeded,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CategoryEdit/reducer'),
          import('containers/CategoryEdit/sagas'),
          import('containers/CategoryEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('categoryEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}

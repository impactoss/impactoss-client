// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { getRedirects } from 'utils/redirects';

import { USER_ROLES } from 'containers/App/constants';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars
  const {
    redirectIfNotSignedIn,
    redirectIfSignedIn,
    redirectIfNotPermitted,
  } = getRedirects(store);

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
      name: 'userLogout',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserLogout'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/login',
      name: 'userLogin',
      onEnter: redirectIfSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserLogin/reducer'),
          import('containers/UserLogin/sagas'),
          import('containers/UserLogin'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('userLogin', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/login/reset',
      name: 'userPasswordReset',
      onEnter: redirectIfSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserPasswordReset/reducer'),
          import('containers/UserPasswordReset/sagas'),
          import('containers/UserPasswordReset'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('userPasswordReset', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/register',
      name: 'userRegister',
      onEnter: redirectIfSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserRegister/reducer'),
          import('containers/UserRegister/sagas'),
          import('containers/UserRegister'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('userRegister', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/users',
      name: 'userList',
      onEnter: redirectIfNotSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/users/:id',
      name: 'userView',
      onEnter: redirectIfNotSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/users/edit/:id',
      name: 'userEdit',
      onEnter: redirectIfNotSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserEdit/reducer'),
          import('containers/UserEdit/sagas'),
          import('containers/UserEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('userEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/users/password/:id',
      name: 'userPassword',
      onEnter: redirectIfNotSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserPassword/reducer'),
          import('containers/UserPassword/sagas'),
          import('containers/UserPassword'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('userPassword', reducer.default);
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
          import('containers/ActionList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/actions/new',
      name: 'actionNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
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
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
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
          import('containers/RecommendationList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
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
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
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
      path: '/indicators',
      name: 'indicatorList',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IndicatorList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/indicators/new',
      name: 'indicatorNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IndicatorNew/reducer'),
          import('containers/IndicatorNew/sagas'),
          import('containers/IndicatorNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('indicatorNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/indicators/:id',
      name: 'indicatorView',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IndicatorView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/indicators/edit/:id',
      name: 'indicatorEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IndicatorEdit/reducer'),
          import('containers/IndicatorEdit/sagas'),
          import('containers/IndicatorEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('indicatorEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/reports/new/:id', // the indicator id
      name: 'reportNew',
      onEnter: redirectIfNotSignedIn,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ReportNew/reducer'),
          import('containers/ReportNew/sagas'),
          import('containers/ReportNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('reportNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/reports/:id', // the report id
      name: 'reportView',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ReportView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/reports/edit/:id',
      name: 'reportEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.CONTRIBUTOR),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ReportEdit/reducer'),
          import('containers/ReportEdit/sagas'),
          import('containers/ReportEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('reportEdit', reducer.default);
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
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
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
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER),
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
      path: '/pages',
      name: 'pageList',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PageList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/pages/new',
      name: 'pageNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.ADMIN),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PageNew/reducer'),
          import('containers/PageNew/sagas'),
          import('containers/PageNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('pageNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/pages/:id',
      name: 'pageView',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PageView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/pages/edit/:id',
      name: 'pageEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.ADMIN),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/PageEdit/reducer'),
          import('containers/PageEdit/sagas'),
          import('containers/PageEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('pageEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/not-authorized',
      name: 'notauthorized',
      getComponent(nextState, cb) {
        import('containers/NotAuthorizedPage')
        .then(loadModule(cb))
        .catch(errorLoading);
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

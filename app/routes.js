// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { getRedirects } from 'utils/redirects';

import { PATHS } from 'containers/App/constants';
import { USER_ROLES, ENABLE_SDGS } from 'themes/config';

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
    redirectIfSignedIn,
    redirectIfNotSignedIn,
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
      path: PATHS.OVERVIEW,
      name: 'overview',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Overview'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: PATHS.LOGOUT,
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
      path: PATHS.LOGIN,
      name: 'userLogin',
      onEnter: redirectIfSignedIn(),
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
      path: PATHS.RECOVER_PASSWORD,
      name: 'userPasswordRecover',
      onEnter: redirectIfSignedIn(),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserPasswordRecover/reducer'),
          import('containers/UserPasswordRecover/sagas'),
          import('containers/UserPasswordRecover'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('userPasswordRecover', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: PATHS.RESET_PASSWORD,
      name: 'userPasswordReset',
      onEnter: redirectIfSignedIn(),
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
      path: PATHS.REGISTER,
      name: 'userRegister',
      onEnter: redirectIfSignedIn(),
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
      path: PATHS.USERS,
      name: 'userList',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
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
      path: `${PATHS.USERS}${PATHS.ID}`,
      name: 'userView',
      onEnter: redirectIfNotSignedIn(),
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
      path: `${PATHS.USERS}${PATHS.EDIT}${PATHS.ID}`,
      name: 'userEdit',
      onEnter: redirectIfNotSignedIn(),
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
      path: `${PATHS.USERS}${PATHS.PASSWORD}${PATHS.ID}`,
      name: 'userPassword',
      onEnter: redirectIfNotSignedIn(),
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
      path: PATHS.MEASURES,
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
      path: `${PATHS.MEASURES}${PATHS.NEW}`,
      name: 'actionNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionNew/reducer'),
          import('containers/ActionNew/sagas'),
          import('containers/ActionNew'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('measureNew', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${PATHS.MEASURES}${PATHS.IMPORT}`,
      name: 'actionImport',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionImport/reducer'),
          import('containers/ActionImport/sagas'),
          import('containers/ActionImport'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('measureImport', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${PATHS.MEASURES}${PATHS.ID}`,
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
      path: `${PATHS.MEASURES}${PATHS.EDIT}${PATHS.ID}`,
      name: 'actionEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ActionEdit/reducer'),
          import('containers/ActionEdit/sagas'),
          import('containers/ActionEdit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('measureEdit', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: PATHS.SDG_TARGETS,
      name: ENABLE_SDGS ? 'sdgtargetList' : 'notfound',
      getComponent(nextState, cb) {
        if (ENABLE_SDGS) {
          const importModules = Promise.all([
            import('containers/SdgTargetList'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        } else {
          import('containers/NotFoundPage')
            .then(loadModule(cb))
            .catch(errorLoading);
        }
      },
    }, {
      path: `${PATHS.SDG_TARGETS}${PATHS.NEW}`,
      name: ENABLE_SDGS ? 'sdgtargetNew' : 'notfound',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        if (ENABLE_SDGS) {
          const importModules = Promise.all([
            import('containers/SdgTargetNew/reducer'),
            import('containers/SdgTargetNew/sagas'),
            import('containers/SdgTargetNew'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('sdgtargetNew', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        } else {
          import('containers/NotFoundPage')
            .then(loadModule(cb))
            .catch(errorLoading);
        }
      },
    }, {
      path: `${PATHS.SDG_TARGETS}${PATHS.IMPORT}`,
      name: ENABLE_SDGS ? 'sdgtargetImport' : 'notfound',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        if (ENABLE_SDGS) {
          const importModules = Promise.all([
            import('containers/SdgTargetImport/reducer'),
            import('containers/SdgTargetImport/sagas'),
            import('containers/SdgTargetImport'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('sdgtargetImport', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        } else {
          import('containers/NotFoundPage')
            .then(loadModule(cb))
            .catch(errorLoading);
        }
      },
    }, {
      path: `${PATHS.SDG_TARGETS}${PATHS.ID}`,
      name: ENABLE_SDGS ? 'sdgtargetView' : 'notfound',
      getComponent(nextState, cb) {
        if (ENABLE_SDGS) {
          const importModules = Promise.all([
            import('containers/SdgTargetView'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([component]) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        } else {
          import('containers/NotFoundPage')
            .then(loadModule(cb))
            .catch(errorLoading);
        }
      },
    }, {
      path: `${PATHS.SDG_TARGETS}${PATHS.EDIT}${PATHS.ID}`,
      name: ENABLE_SDGS ? 'sdgtargetEdit' : 'notfound',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        if (ENABLE_SDGS) {
          const importModules = Promise.all([
            import('containers/SdgTargetEdit/reducer'),
            import('containers/SdgTargetEdit/sagas'),
            import('containers/SdgTargetEdit'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('sdgtargetEdit', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        } else {
          import('containers/NotFoundPage')
            .then(loadModule(cb))
            .catch(errorLoading);
        }
      },
    }, {
      path: PATHS.RECOMMENDATIONS,
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
      path: `${PATHS.RECOMMENDATIONS}${PATHS.NEW}`,
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
      path: `${PATHS.RECOMMENDATIONS}${PATHS.IMPORT}`,
      name: 'recommendationImport',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RecommendationImport/reducer'),
          import('containers/RecommendationImport/sagas'),
          import('containers/RecommendationImport'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('recommendationImport', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${PATHS.RECOMMENDATIONS}${PATHS.ID}`,
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
      path: `${PATHS.RECOMMENDATIONS}${PATHS.EDIT}${PATHS.ID}`,
      name: 'recommendationEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
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
      path: PATHS.INDICATORS,
      name: 'indicatorList',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value, PATHS.MEASURES),
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
      path: `${PATHS.INDICATORS}${PATHS.NEW}`,
      name: 'indicatorNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
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
      path: `${PATHS.INDICATORS}${PATHS.IMPORT}`,
      name: 'indicatorImport',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IndicatorImport/reducer'),
          import('containers/IndicatorImport/sagas'),
          import('containers/IndicatorImport'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('indicatorImport', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${PATHS.INDICATORS}${PATHS.ID}`,
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
      path: `${PATHS.INDICATORS}${PATHS.EDIT}${PATHS.ID}`,
      name: 'indicatorEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
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
      path: `${PATHS.PROGRESS_REPORTS}${PATHS.NEW}${PATHS.ID}`, // the indicator id
      name: 'reportNew',
      onEnter: redirectIfNotSignedIn('signInGuestReport'),
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
      path: `${PATHS.PROGRESS_REPORTS}${PATHS.ID}`, // the report id
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
      path: `${PATHS.PROGRESS_REPORTS}${PATHS.EDIT}${PATHS.ID}`,
      name: 'reportEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.CONTRIBUTOR.value),
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
    // }, {
    //   path: PATHS.TAXONOMIES,
    //   name: 'taxonomies',
    //   onEnter: (nextState, replace) => replace(`${PATHS.TAXONOMIES}/1`),
    }, {
      path: `${PATHS.TAXONOMIES}${PATHS.ID}`, // the taxonomy id
      name: 'categoryList',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/CategoryList/sagas'),
          import('containers/CategoryList'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: `${PATHS.TAXONOMIES}${PATHS.ID}${PATHS.NEW}`, // the taxonomy id
      name: 'categoryNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
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
      path: `${PATHS.CATEGORIES}${PATHS.ID}`,
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
      path: `${PATHS.CATEGORIES}${PATHS.EDIT}${PATHS.ID}`,
      name: 'categoryEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.MANAGER.value),
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
      path: PATHS.PAGES,
      name: 'pageList',
      onEnter: redirectIfNotPermitted(USER_ROLES.CONTRIBUTOR.value),
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
      path: `${PATHS.PAGES}${PATHS.NEW}`,
      name: 'pageNew',
      onEnter: redirectIfNotPermitted(USER_ROLES.ADMIN.value),
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
      path: `${PATHS.PAGES}${PATHS.ID}`,
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
      path: `${PATHS.PAGES}${PATHS.EDIT}${PATHS.ID}`,
      name: 'pageEdit',
      onEnter: redirectIfNotPermitted(USER_ROLES.ADMIN.value),
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
      path: PATHS.SEARCH,
      name: 'indicatorList',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Search/sagas'),
          import('containers/Search'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: PATHS.UNAUTHORISED,
      name: 'unauthorised',
      getComponent(nextState, cb) {
        import('containers/Unauthorised')
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

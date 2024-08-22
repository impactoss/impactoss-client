/**
 *
 * App.js
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import ReactModal from 'react-modal';
import GlobalStyle from 'global-styles';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import Header from 'components/Header';
import SkipContent from 'components/styled/SkipContent';
import EntityNew from 'containers/EntityNew';
import GlobalSettings from 'containers/GlobalSettings';

import { sortEntities } from 'utils/sort';
import { canUserManageUsers, canUserManagePages } from 'utils/permissions';

import { FOOTER } from 'themes/config';

import {
  selectIsSignedIn,
  selectSessionUserAttributes,
  selectSessionUserHighestRoleId,
  selectReady,
  selectFrameworks,
  selectEntitiesWhere,
  selectNewEntityModal,
  selectCurrentFrameworkId,
  selectViewRecommendationFrameworkId,
  selectShowSettings,
  selectHasPreviousCycles,
  selectSettings,
} from './selectors';

import {
  validateToken,
  loadEntitiesIfNeeded,
  updatePath,
  updateRouteQuery,
  openNewEntityModal,
  showSettingsModal,
  initializeSettings,
} from './actions';

import { ROUTES, DEPENDENCIES } from './constants';

import messages from './messages';

const Main = styled.div`
  position: absolute;
  top: ${(props) => props.isHome
    ? props.theme.sizes.header.banner.heightMobile
    : props.theme.sizes.header.banner.heightMobile + props.theme.sizes.header.nav.heightMobile
}px;
  left: 0;
  right: 0;
  bottom:0;
  background-color: ${(props) => props.isHome ? 'transparent' : palette('mainBackground', 0)};
  overflow: ${(props) => props.isHome ? 'auto' : 'hidden'};

  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    top: ${(props) => props.isHome
    ? props.theme.sizes.header.banner.height
    : props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height
}px;
  }
  @media print {
    background: white;
    position: static;
  }
`;

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.validateToken();
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataReady, settings } = nextProps;
    // reload entities if invalidated
    if (!dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (dataReady && settings) {
      // only iniitlize settings if some not yet initialized (available = null)
      if (settings.some((setting) => setting.get('available') === null)) {
        this.props.onInitializeSettings(nextProps);
      }
    }
  }

  preparePageMenuPages = (pages) => sortEntities(
    pages,
    'asc',
    'order',
    'number'
  )
    .filter((page) => FOOTER.INTERNAL_LINKS.indexOf(parseInt(page.get('id'), 10)) < 0)
    .map((page) => ({
      path: `${ROUTES.PAGES}/${page.get('id')}`,
      title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
    }))
    .toArray();

  prepareFrameworkOptions = (frameworks, activeId) => {
    const { intl } = this.context;
    const options = Object.values(frameworks.toJS()).map((fw) => ({
      value: fw.id,
      label: intl.formatMessage(messages.frameworks[fw.id]),
      active: activeId === fw.id,
    }));
    return options.concat({
      value: 'all',
      label: intl.formatMessage(messages.frameworks.all),
      active: (activeId === 'all') || frameworks.size === 0,
    });
  };

  prepareMainMenuItems = (
    highestRole,
    isUserSignedIn,
    currentPath,
    currentFrameworkId,
    viewRecommendationFramework,
  ) => {
    const { intl } = this.context;
    let navItems = [
      {
        path: ROUTES.OVERVIEW,
        titleSuper: intl.formatMessage(messages.nav.overviewSuper),
        title: intl.formatMessage(messages.nav.overview),
        active:
          currentPath === ROUTES.OVERVIEW
          || currentPath.startsWith(ROUTES.TAXONOMIES)
          || currentPath.startsWith(ROUTES.CATEGORIES),
      },
      {
        path: ROUTES.RECOMMENDATIONS,
        titleSuper: intl.formatMessage(messages.nav.recommendationsSuper),
        title: intl.formatMessage(messages.frameworkObjectivesShort[currentFrameworkId]),
        active: currentPath.startsWith(ROUTES.RECOMMENDATIONS) && (
          !viewRecommendationFramework
          || currentFrameworkId === 'all'
          || currentFrameworkId === viewRecommendationFramework
        ),
      },
      {
        path: ROUTES.MEASURES,
        titleSuper: intl.formatMessage(messages.nav.measuresSuper),
        title: intl.formatMessage(messages.nav.measures),
        active: currentPath.startsWith(ROUTES.MEASURES),
      },
    ];
    navItems = navItems.concat([{
      path: ROUTES.INDICATORS,
      titleSuper: intl.formatMessage(messages.nav.indicatorsSuper),
      title: intl.formatMessage(messages.nav.indicators),
      active:
        currentPath.startsWith(ROUTES.INDICATORS)
        || currentPath.startsWith(ROUTES.PROGRESS_REPORTS),
    }]);
    if (canUserManagePages(highestRole)) {
      navItems = navItems.concat([
        {
          path: ROUTES.PAGES,
          title: intl.formatMessage(messages.nav.pages),
          isAdmin: true,
          active: currentPath === ROUTES.PAGES,
        },
      ]);
    }
    if (canUserManageUsers(highestRole)) {
      navItems = navItems.concat([
        {
          path: ROUTES.USERS,
          title: intl.formatMessage(messages.nav.users),
          isAdmin: true,
          active: currentPath === ROUTES.USERS,
        },
      ]);
    }
    if (isUserSignedIn) {
      navItems = navItems.concat([
        {
          path: ROUTES.BOOKMARKS,
          title: intl.formatMessage(messages.nav.bookmarks),
          isAdmin: true,
          active: currentPath === ROUTES.BOOKMARKS,
        },
      ]);
    }
    return navItems;
  };

  render() {
    const {
      pages,
      onPageLink,
      isUserSignedIn,
      highestRole,
      location,
      newEntityModal,
      currentFrameworkId,
      frameworks,
      onSelectFramework,
      viewRecommendationFramework,
      user,
      children,
      showSettings,
      onShowSettings,
      dataReady,
      settings,
    } = this.props;
    const { intl } = this.context;
    const title = intl.formatMessage(messages.app.title);
    const isHome = location.pathname === ROUTES.INTRO || location.pathname === `${ROUTES.INTRO}/`;
    const hasSettings = settings && settings.some((val) => !!val.get('available'));
    return (
      <div>
        <SkipContent
          href="#main-content"
          title={this.context.intl.formatMessage(messages.screenreader.skipToContent)}
        >
          <FormattedMessage {...messages.screenreader.skipToContent} />
        </SkipContent>
        <HelmetCanonical titleTemplate={`${title} - %s`} defaultTitle={title} />
        <Header
          isSignedIn={isUserSignedIn}
          user={user}
          pages={pages && this.preparePageMenuPages(pages)}
          navItems={this.prepareMainMenuItems(
            highestRole,
            isUserSignedIn,
            location.pathname,
            currentFrameworkId,
            viewRecommendationFramework,
          )}
          search={{
            path: ROUTES.SEARCH,
            title: intl.formatMessage(messages.nav.search),
            active: location.pathname.startsWith(ROUTES.SEARCH),
            icon: 'search',
          }}
          onPageLink={onPageLink}
          isHome={isHome}
          onSelectFramework={onSelectFramework}
          frameworkOptions={frameworks && frameworks.size > 1
            ? this.prepareFrameworkOptions(
              frameworks,
              currentFrameworkId,
            )
            : null}
          currentPath={location.pathname}
          fullPath={`${location.pathname}${location.search}`}
          brandPath={ROUTES.OVERVIEW}
          onShowSettings={() => onShowSettings(true)}
          hasSettings={dataReady && hasSettings}
        />
        <Main isHome={isHome} role="main" id="main-content">
          {React.Children.toArray(children)}
        </Main>
        {newEntityModal
          && (
            <ReactModal
              isOpen
              appElement={document.getElementById('app')}
              contentLabel={newEntityModal.get('path')}
              onRequestClose={this.props.onCloseModal}
              className="new-entity-modal"
              overlayClassName="new-entity-modal-overlay"
              style={{
                overlay: { zIndex: 99999999 },
              }}
            >
              <EntityNew
                path={newEntityModal.get('path')}
                attributes={newEntityModal.get('attributes')}
                onSaveSuccess={this.props.onCloseModal}
                onCancel={this.props.onCloseModal}
                inModal
              />
            </ReactModal>
          )
        }
        {showSettings && (
          <ReactModal
            isOpen
            appElement={document.getElementById('app')}
            contentLabel="Settings"
            onRequestClose={() => onShowSettings(false)}
            className="global-settings-modal"
            overlayClassName="global-settings-modal-overlay"
            style={{
              overlay: { zIndex: 99999999 },
            }}
          >
            <GlobalSettings
              onClose={() => onShowSettings(false)}
              settings={settings}
            />
          </ReactModal>
        )}
        <GlobalStyle />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  isUserSignedIn: PropTypes.bool,
  highestRole: PropTypes.number,
  user: PropTypes.object,
  pages: PropTypes.object,
  validateToken: PropTypes.func,
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  newEntityModal: PropTypes.object,
  onCloseModal: PropTypes.func,
  onSelectFramework: PropTypes.func,
  currentFrameworkId: PropTypes.string,
  viewRecommendationFramework: PropTypes.string,
  frameworks: PropTypes.object,
  onShowSettings: PropTypes.func,
  showSettings: PropTypes.bool,
  hasPreviousCycles: PropTypes.bool,
  onInitializeSettings: PropTypes.func,
  settings: PropTypes.object,
  dataReady: PropTypes.bool,
};
App.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  highestRole: selectSessionUserHighestRoleId(state),
  isUserSignedIn: selectIsSignedIn(state),
  user: selectSessionUserAttributes(state),
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
  newEntityModal: selectNewEntityModal(state),
  showSettings: selectShowSettings(state),
  currentFrameworkId: selectCurrentFrameworkId(state),
  frameworks: selectFrameworks(state),
  hasPreviousCycles: selectHasPreviousCycles(state),
  viewRecommendationFramework: selectViewRecommendationFrameworkId(state, props.params.id),
  settings: selectSettings(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    validateToken: () => {
      dispatch(validateToken()); // Maybe this could move to routes.js or App wrapper
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
    // open: bool
    onShowSettings: (open) => {
      dispatch(showSettingsModal(open));
    },
    onCloseModal: () => {
      dispatch(openNewEntityModal(null));
    },
    onSelectFramework: (framework) => {
      dispatch(updateRouteQuery(
        {
          arg: 'fw',
          value: framework,
          replace: true,
        }
      ));
    },
    onInitializeSettings: ({
      settings, // immutable Map
      isUserSignedIn,
      highestRole,
      hasPreviousCycles,
    }) => {
      // only initialize settings not previously initialized (available === null)
      const updatedSettings = settings.map((setting, key) => {
        let updated = setting;
        if (setting.get('available') === null) {
          if (key === 'loadArchived' && isUserSignedIn) {
            updated = setting.set('available', highestRole <= setting.get('minRole'));
          }
          if (key === 'loadNonCurrent') {
            updated = setting.set('available', hasPreviousCycles);
          }
        }
        return updated;
      });
      dispatch(initializeSettings(updatedSettings));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

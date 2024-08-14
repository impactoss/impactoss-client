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
} from './selectors';

import {
  validateToken,
  loadEntitiesIfNeeded,
  updatePath,
  updateRouteQuery,
  openNewEntityModal,
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
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.validateToken();
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  onShowSettings = (showSettings) => {
    this.setState({
      showSettings,
    });
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
    } = this.props;
    const { intl } = this.context;
    const title = intl.formatMessage(messages.app.title);
    const isHome = location.pathname === ROUTES.INTRO || location.pathname === `${ROUTES.INTRO}/`;
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
          brandPath={ROUTES.OVERVIEW}
          showSettings={() => this.onShowSettings(true)}
        />
        <Main isHome={isHome} role="main" id="main-content">
          {React.Children.toArray(children)}
        </Main>
        {newEntityModal
          && (
            <ReactModal
              isOpen
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
        {this.state.showSettings && (
          <ReactModal
            isOpen
            contentLabel="Settings"
            onRequestClose={() => this.onShowSettings(false)}
            className="global-settings-modal"
            overlayClassName="global-settings-modal-overlay"
            style={{
              overlay: { zIndex: 99999999 },
            }}
          >
            <GlobalSettings
              onClose={() => this.onShowSettings(false)}
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
  currentFrameworkId: selectCurrentFrameworkId(state),
  frameworks: selectFrameworks(state),
  viewRecommendationFramework: selectViewRecommendationFrameworkId(state, props.params.id),
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
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

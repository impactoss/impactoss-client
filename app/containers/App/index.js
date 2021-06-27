/**
 *
 * App.js
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ReactModal from 'react-modal';
import GlobalStyle from 'global-styles';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import Header from 'components/Header';
import EntityNew from 'containers/EntityNew';

import { sortEntities } from 'utils/sort';

import {
  selectIsSignedIn,
  selectIsUserManager,
  selectSessionUserAttributes,
  selectReady,
  selectFrameworks,
  selectEntitiesWhere,
  selectNewEntityModal,
  selectFrameworkQuery,
  selectViewRecommendationFrameworkId,
} from './selectors';

import {
  validateToken,
  loadEntitiesIfNeeded,
  updatePath,
  updateRouteQuery,
  openNewEntityModal,
} from './actions';

import { PATHS, DEPENDENCIES } from './constants';

import messages from './messages';

const Main = styled.div`
  position: ${(props) => props.isHome ? 'relative' : 'absolute'};
  top: ${(props) => props.isHome
    ? 0
    : props.theme.sizes.header.banner.heightMobile + props.theme.sizes.header.nav.heightMobile
}px;
  left: 0;
  right: 0;
  bottom:0;
  background-color: ${(props) => props.isHome ? 'transparent' : palette('light', 0)};
  overflow: hidden;

  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    top: ${(props) => props.isHome
    ? 0
    : props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height
}px;
  }
  @media print {
    background: white;
    position: static;
  }
`;
// overflow: ${(props) => props.isHome ? 'auto' : 'hidden'};

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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

  preparePageMenuPages = (pages) => sortEntities(
    pages,
    'asc',
    'order',
    'number'
  )
    .map((page) => ({
      path: `${PATHS.PAGES}/${page.get('id')}`,
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
  }

  prepareMainMenuItems = (
    isManager,
    isUserSignedIn,
    currentPath,
    currentFrameworkId,
    viewRecommendationFramework,
  ) => {
    const { intl } = this.context;
    let navItems = [
      {
        path: PATHS.OVERVIEW,
        titleSuper: intl.formatMessage(messages.nav.overviewSuper),
        title: intl.formatMessage(messages.nav.overview),
        active:
          currentPath.startsWith(PATHS.OVERVIEW)
          || currentPath.startsWith(PATHS.TAXONOMIES)
          || currentPath.startsWith(PATHS.CATEGORIES),
      },
      {
        path: PATHS.RECOMMENDATIONS,
        titleSuper: intl.formatMessage(messages.nav.recommendationsSuper),
        title: intl.formatMessage(messages.frameworkObjectivesShort[currentFrameworkId]),
        active: currentPath.startsWith(PATHS.RECOMMENDATIONS) && (
          !viewRecommendationFramework
          || currentFrameworkId === 'all'
          || currentFrameworkId === viewRecommendationFramework
        ),
      },
      {
        path: PATHS.MEASURES,
        titleSuper: intl.formatMessage(messages.nav.measuresSuper),
        title: intl.formatMessage(messages.nav.measures),
        active: currentPath.startsWith(PATHS.MEASURES),
      },
    ];
    navItems = navItems.concat([{
      path: PATHS.INDICATORS,
      titleSuper: intl.formatMessage(messages.nav.indicatorsSuper),
      title: intl.formatMessage(messages.nav.indicators),
      active:
        currentPath.startsWith(PATHS.INDICATORS)
        || currentPath.startsWith(PATHS.PROGRESS_REPORTS),
    }]);
    if (isManager) {
      navItems = navItems.concat([
        {
          path: PATHS.PAGES,
          title: intl.formatMessage(messages.nav.pages),
          isAdmin: true,
          active: currentPath === PATHS.PAGES,
        },
        {
          path: PATHS.USERS,
          title: intl.formatMessage(messages.nav.users),
          isAdmin: true,
          active: currentPath === PATHS.USERS,
        },
      ]);
    }
    if (isUserSignedIn) {
      navItems = navItems.concat([
        {
          path: PATHS.BOOKMARKS,
          title: intl.formatMessage(messages.nav.bookmarks),
          isAdmin: true,
          active: currentPath === PATHS.BOOKMARKS,
        },
      ]);
    }
    return navItems;
  }

  render() {
    const {
      pages,
      onPageLink,
      isUserSignedIn,
      isManager,
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
    return (
      <div>
        <Helmet titleTemplate={`${title} - %s`} defaultTitle={title} />
        <Header
          isSignedIn={isUserSignedIn}
          user={user}
          pages={pages && this.preparePageMenuPages(pages)}
          navItems={this.prepareMainMenuItems(
            isUserSignedIn && isManager,
            isUserSignedIn,
            location.pathname,
            currentFrameworkId,
            viewRecommendationFramework,
          )}
          search={{
            path: PATHS.SEARCH,
            title: intl.formatMessage(messages.nav.search),
            active: location.pathname.startsWith(PATHS.SEARCH),
            icon: 'search',
          }}
          onPageLink={onPageLink}
          isHome={location.pathname === '/'}
          onSelectFramework={onSelectFramework}
          frameworkOptions={this.prepareFrameworkOptions(
            frameworks,
            currentFrameworkId,
          )}
        />
        <Main isHome={location.pathname === '/'}>
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
        <GlobalStyle />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  isUserSignedIn: PropTypes.bool,
  isManager: PropTypes.bool,
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
  isManager: selectIsUserManager(state),
  isUserSignedIn: selectIsSignedIn(state),
  user: selectSessionUserAttributes(state),
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
  newEntityModal: selectNewEntityModal(state),
  currentFrameworkId: selectFrameworkQuery(state),
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

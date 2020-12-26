/**
 *
 * App.js
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Perf from 'react-addons-perf';
import ReactModal from 'react-modal';

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
  selectEntities,
  selectEntitiesWhere,
  selectNewEntityModal,
  selectFrameworkQuery,
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
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    top: ${(props) => props.isHome
      ? 0
      : props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height
    }px;
  }
  overflow: ${(props) => props.isHome ? 'auto' : 'hidden'};
  left: 0;
  right: 0;
  bottom:0;
  background-color: ${(props) => props.isHome ? 'transparent' : palette('light', 0)};
  overflow: hidden;
`;

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.validateToken();
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  preparePageMenuPages = (pages) =>
    sortEntities(
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

  prepareFrameworkOptions = (frameworks) => {
    const options = Object.values(frameworks.toJS()).map((fw) => ({
      value: fw.id,
      label: this.context.intl.formatMessage(messages.frameworks[fw.id]),
    }));
    return options.concat({
      value: 'all',
      label: this.context.intl.formatMessage(messages.frameworks.all),
    });
  }
  prepareMainMenuItems = (isManager, currentPath, currentFrameworkId) => {
    let navItems = [
      {
        path: PATHS.OVERVIEW,
        titleSuper: this.context.intl.formatMessage(messages.nav.overviewSuper),
        title: this.context.intl.formatMessage(messages.nav.overview),
        active: currentPath.startsWith(PATHS.OVERVIEW) || currentPath.startsWith(PATHS.TAXONOMIES) || currentPath.startsWith(PATHS.CATEGORIES),
      },
      {
        path: PATHS.RECOMMENDATIONS,
        titleSuper: this.context.intl.formatMessage(messages.nav.recommendations),
        title: this.context.intl.formatMessage(messages.frameworkObjectivesShort[currentFrameworkId]),
        active: currentPath.startsWith(PATHS.RECOMMENDATIONS),
      },
      {
        path: PATHS.MEASURES,
        titleSuper: this.context.intl.formatMessage(messages.nav.measuresSuper),
        title: this.context.intl.formatMessage(messages.nav.measures),
        active: currentPath.startsWith(PATHS.MEASURES),
      },
    ];
    if (isManager) {
      navItems = navItems.concat([{
        path: PATHS.INDICATORS,
        titleSuper: this.context.intl.formatMessage(messages.nav.indicatorsSuper),
        title: this.context.intl.formatMessage(messages.nav.indicators),
        active: currentPath.startsWith(PATHS.INDICATORS) || currentPath.startsWith(PATHS.PROGRESS_REPORTS),
      }]);
    }
    navItems = navItems.concat([{
      path: PATHS.SEARCH,
      title: this.context.intl.formatMessage(messages.nav.search),
      active: currentPath.startsWith(PATHS.SEARCH),
      icon: 'search',
      align: 'right',
    }]);

    if (isManager) {
      navItems = navItems.concat([
        {
          path: PATHS.USERS,
          title: this.context.intl.formatMessage(messages.nav.users),
          isAdmin: true,
          active: currentPath === PATHS.USERS,
        },
        {
          path: PATHS.PAGES,
          title: this.context.intl.formatMessage(messages.nav.pages),
          isAdmin: true,
          active: currentPath === PATHS.PAGES,
        },
      ]);
    }
    return navItems;
  }

  render() {
    window.Perf = Perf;
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
    } = this.props;
    return (
      <div>
        <Header
          isSignedIn={isUserSignedIn}
          user={this.props.user}
          pages={pages && this.preparePageMenuPages(pages)}
          navItems={this.prepareMainMenuItems(isUserSignedIn && isManager, location.pathname, currentFrameworkId)}
          onPageLink={onPageLink}
          currentPath={location.pathname}
          isHome={location.pathname === '/'}
          currentFrameworkId={currentFrameworkId || 'all'}
          onSelectFramework={onSelectFramework}
          frameworkOptions={frameworks && this.prepareFrameworkOptions(
            frameworks,
            currentFrameworkId,
            onSelectFramework,
          )}
        />
        <Main isHome={location.pathname === '/'}>
          {React.Children.toArray(this.props.children)}
        </Main>
        {newEntityModal &&
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
        }
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
  frameworks: PropTypes.object,
};
App.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
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
  frameworks: selectEntities(state, 'frameworks'),
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
      // dispatch(setFramework(framework));
      dispatch(updateRouteQuery(
        {
          arg: 'fw',
          value: framework,
        }
      ));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

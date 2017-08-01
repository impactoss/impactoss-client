/**
 *
 * App.js
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Perf from 'react-addons-perf';

import styled from 'styled-components';
import Header from 'components/Header';
import {
  selectIsSignedIn,
  selectIsUserManager,
  selectSessionUserId,
  selectReady,
  selectEntitiesWhere,
} from './selectors';
import { validateToken, loadEntitiesIfNeeded, updatePath } from './actions';
import { DEPENDENCIES } from './constants';

import messages from './messages';

const Main = styled.div`
  position: ${(props) => props.isHome ? 'relative' : 'absolute'};
  top: ${(props) => props.isHome ? 0 : '150px'};
  overflow: ${(props) => props.isHome ? 'auto' : 'hidden'};
  left: 0;
  right: 0;
  bottom:0;
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
    pages.map((page) => ({
      path: `/pages/${page.get('id')}`,
      title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
    })).toArray();

  prepareMainMenuItems = (isManager, currentPath) => {
    let navItems = ([
      {
        path: '/overview',
        title: this.context.intl.formatMessage(messages.overview),
        active: currentPath.startsWith('/overview'),
      },
      {
        path: '/categories',
        title: this.context.intl.formatMessage(messages.entities.taxonomies.plural),
        active: currentPath.startsWith('/category'),
      },
      {
        path: '/actions',
        title: this.context.intl.formatMessage(messages.entities.measures.plural),
      },
      {
        path: '/indicators',
        title: this.context.intl.formatMessage(messages.entities.indicators.plural),
        active: currentPath.startsWith('/reports'),
      },
      {
        path: '/recommendations',
        title: this.context.intl.formatMessage(messages.entities.recommendations.plural),
      },
      {
        path: '/sdgtargets',
        title: this.context.intl.formatMessage(messages.entities.sdgtargets.plural),
      },
    ]);
    if (isManager) {
      navItems = navItems.concat([
        {
          path: '/users',
          title: this.context.intl.formatMessage(messages.entities.users.plural),
        },
        {
          path: '/pages',
          title: this.context.intl.formatMessage(messages.entities.pages.plural),
        },
      ]);
    }
    return navItems;
  }

  render() {
    window.Perf = Perf;
    const { pages, onPageLink, isUserSignedIn, isManager, location } = this.props;

    return (
      <div>
        <Header
          isSignedIn={isUserSignedIn}
          userId={this.props.userId}
          pages={pages && this.preparePageMenuPages(pages)}
          navItems={this.prepareMainMenuItems(isUserSignedIn && isManager, location.pathname)}
          onPageLink={onPageLink}
          currentPath={location.pathname}
          isHome={location.pathname === '/'}
        />
        <Main isHome={location.pathname === '/'}>
          {React.Children.toArray(this.props.children)}
        </Main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  isUserSignedIn: PropTypes.bool,
  isManager: PropTypes.bool,
  userId: PropTypes.string,
  pages: PropTypes.object,
  validateToken: PropTypes.func,
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};
App.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  isManager: selectIsUserManager(state),
  isUserSignedIn: selectIsSignedIn(state),
  userId: selectSessionUserId(state),
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
});

export function mapDispatchToProps(dispatch) {
  return {
    validateToken: () => {
      dispatch(validateToken()); // Maybe this could move to routes.js or App wrapper
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

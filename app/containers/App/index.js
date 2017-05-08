/**
 *
 * App.js
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Header from 'components/Header';
import {
  isSignedIn,
  getSessionUserId,
  isUserManager,
  isReady,
  getEntities,
} from './selectors';
import { validateToken, loadEntitiesIfNeeded, updatePath } from './actions';

import messages from './messages';


const Main = styled.div`
  position: absolute;
  top: 115px;
  left: 0;
  right: 0;
  bottom:0;
  overflow: hidden;
`;

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: PropTypes.node,
    isUserSignedIn: PropTypes.bool,
    isManager: PropTypes.bool,
    userId: PropTypes.string,
    pages: PropTypes.object,
    validateToken: PropTypes.func,
    loadEntitiesIfNeeded: PropTypes.func,
    onPageLink: PropTypes.func,
    location: PropTypes.object.isRequired,
  };
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

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
    Object.values(pages).map((page) => ({
      path: `/pages/${page.id}`,
      title: page.attributes.menu_title || page.attributes.title,
    }));

  prepareMainMenuItems = (isManager, currentPath) => {
    let navItems = ([
      {
        path: '/categories',
        title: this.context.intl.formatMessage(messages.entities.taxonomies.plural),
        active: currentPath.startsWith('/category'),
      },
      {
        path: '/recommendations',
        title: this.context.intl.formatMessage(messages.entities.recommendations.plural),
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
        />
        <Main>
          {React.Children.toArray(this.props.children)}
        </Main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'user_roles',
    'pages',
  ] }),
  isManager: isUserManager(state),
  isUserSignedIn: isSignedIn(state),
  userId: getSessionUserId(state),
  pages: getEntities(
    state,
    {
      path: 'pages',
      where: { draft: false },
      out: 'js',
    },
  ),
});

export function mapDispatchToProps(dispatch) {
  return {
    validateToken: () => {
      dispatch(validateToken()); // Maybe this could move to routes.js or App wrapper
    },
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('pages'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

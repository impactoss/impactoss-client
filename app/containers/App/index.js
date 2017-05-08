/**
 *
 * App.js
 *
 */

import React from 'react';
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
  top: 120px;
  left: 0;
  right: 0;
  bottom:0;
  overflow: hidden;
`;

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    isUserSignedIn: React.PropTypes.bool,
    isManager: React.PropTypes.bool,
    userId: React.PropTypes.string,
    pages: React.PropTypes.object,
    validateToken: React.PropTypes.func,
    loadEntitiesIfNeeded: React.PropTypes.func,
    onPageLink: React.PropTypes.func,
  };
  static contextTypes = {
    intl: React.PropTypes.object.isRequired,
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
  prepareMainMenuItems = (isManager) => {
    let navItems = ([
      {
        path: '/categories',
        title: this.context.intl.formatMessage(messages.entities.taxonomies.plural),
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
    const { pages, onPageLink, isUserSignedIn, isManager } = this.props;
    return (
      <div>
        <Header
          isSignedIn={isUserSignedIn}
          userId={this.props.userId}
          pages={pages && this.preparePageMenuPages(pages)}
          navItems={this.prepareMainMenuItems(isUserSignedIn && isManager)}
          onPageLink={onPageLink}
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

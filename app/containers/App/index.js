/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
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
 } from './selectors';
import { validateToken, loadEntitiesIfNeeded } from './actions';

const Main = styled.div`
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom:0;
  overflow: hidden;
`;

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    isSignedIn: React.PropTypes.bool,
    isManager: React.PropTypes.bool,
    userId: React.PropTypes.string,
    validateToken: React.PropTypes.func,
    loadEntitiesIfNeeded: React.PropTypes.func,
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

  render() {
    return (
      <div>
        <Header
          isSignedIn={this.props.isSignedIn}
          isManager={this.props.isManager}
          userId={this.props.userId}
        />
        <Main>
          {React.Children.toArray(this.props.children)}
        </Main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: 'user_roles' }),
  isManager: isUserManager(state),
  isSignedIn: isSignedIn(state),
  userId: getSessionUserId(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    validateToken: () => {
      dispatch(validateToken()); // Maybe this could move to routes.js or App wrapper
    },
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

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
import { createStructuredSelector } from 'reselect';

import Header from 'components/Header';
import { makeSelectSignedIn, makeSelectSessionUserId } from './selectors';
import { validateToken } from './actions';


class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
    isSignedIn: React.PropTypes.bool,
    userId: React.PropTypes.string,
    validateToken: React.PropTypes.func,
  };

  componentWillMount() {
    this.props.validateToken();
  }

  render() {
    return (
      <div>
        <Header
          isSignedIn={this.props.isSignedIn}
          userId={this.props.userId}
        />
        {React.Children.toArray(this.props.children)}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isSignedIn: makeSelectSignedIn(),
  userId: makeSelectSessionUserId(),
});

export function mapDispatchToProps(dispatch) {
  return {
    validateToken: () => {
      dispatch(validateToken()); // Maybe this could move to routes.js or App wrapper
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

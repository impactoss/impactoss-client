/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  // makeSelectLoading,
  // makeSelectError,
} from 'containers/App/selectors';

import messages from './messages';
import { loadEntitiesIfNeeded } from '../App/actions';


export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function


  /**
   * load actions
   */
  componentDidMount() {
    this.props.onComponentDidMount();
  }

  render() {
    // const { loading, error, actions } = this.props;
    // const actionsListProps = {
    //   loading,
    //   error,
    //   actions,
    // };

    return (
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
    );
  }
}


HomePage.propTypes = {
  // loading: React.PropTypes.bool,
  // error: React.PropTypes.oneOfType([
  //   React.PropTypes.object,
  //   React.PropTypes.bool,
  // ]),
  // actions: React.PropTypes.oneOfType([
  //   React.PropTypes.array,
  //   React.PropTypes.bool,
  // ]),
  onComponentDidMount: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentDidMount: () => {
      // consider using https://github.com/tshelburne/redux-batched-actions
      dispatch(loadEntitiesIfNeeded('actions'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_actions'));
      dispatch(loadEntitiesIfNeeded('users'));// Giving not acceptable header
    },
  };
}

const mapStateToProps = createStructuredSelector({
  // actions: makeSelectEntities('actions'),
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

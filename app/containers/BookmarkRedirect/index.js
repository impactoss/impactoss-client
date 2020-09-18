/*
 *
 * BookmarkRedirect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { selectReady } from 'containers/App/selectors';

// import appMessages from 'containers/App/messages';
// import messages from './messages';
import { selectViewEntity } from './selectors';
import { DEPENDENCIES } from './constants';

export class BookmarkRedirect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const { bookmark, dataReady } = this.props;

    if (dataReady) {
      const jsonView = JSON.stringify(bookmark.getIn(['attributes', 'view']).toObject());

      return <pre>{jsonView}</pre>;
    }

    return null;
  }
}

BookmarkRedirect.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  bookmark: PropTypes.object,
  dataReady: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  bookmark: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkRedirect);

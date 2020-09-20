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

  getEntries = (subView) => (Object.entries(subView)
    .filter(([, value]) => value) // filter out if parameter is not defined
  )

  render() {
    const { bookmark, dataReady } = this.props;

    if (dataReady) {
      const view = bookmark.getIn(['attributes', 'view']).toJS();
      // if(!view.type) {
        // TODO return error: invalid bookmark
      // }

      const {
        type,
        subgroup, group, expand, sort, order,
        cat, catx, where, connected,
      } = view;

      const singleValue = this.getEntries({ subgroup, group, expand, sort, order })
        .map((entry) => entry.join('='));
      const cats = (cat || []).map((id) => `cat=${id}`);
      const multiValue = this.getEntries({ catx, where, connected })
        .flatMap(
          ([filter, objects]) => objects.map(
            ({ key, value }) => `${filter}=${key}:${value}`
          )
        );

      const queryParts = [...singleValue, ...cats, ...multiValue];

      // redirecting to built url
      window.location.href = `/${type}?${queryParts.join('&')}`;
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

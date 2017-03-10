/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import EntityQuery from 'containers/EntityQuery';
import { updateQueryStringParams } from 'utils/history';

// import {
//   makeEntitiesPagedSelector,
//   // sortBySelector,
// } from 'containers/App/selectors';
//
// import {
//   // actionsPagedSelector,
//   sortBySelector,
// } from './selectors';


import {
  setSort,
} from './actions';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    componentWillMount: PropTypes.func,
    location: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.componentWillMount();
  }

  getQueryVar = (key) =>
    key in this.props.location.query ? this.props.location.query[key] : null;

  setPage = (page) => {
    updateQueryStringParams({ page });
  }

  setSort = (sortBy, sortOrder) => {
    updateQueryStringParams({ sortBy, sortOrder });
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/actions/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const { page, sortBy, sortOrder } = this.props.location.query;
    const currentPage = parseInt(page || 1, 10);

    return (
      <div>
        <Helmet
          title="SADATA - List Actions"
          meta={[
            { name: 'description', content: 'Description of ActionList' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Link to="actions/new">Add Action</Link>
        <EntityQuery
          mapEntities={this.mapToEntityList}
          entities="actions"
          currentPage={currentPage}
          onSetPage={this.setPage}
          onSort={this.setSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    componentWillMount: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
    },
    onSetOrder: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(setSort('id', evt.target.value));
    },
  };
}

// export default connect(makeMapStateToProps(), mapDispatchToProps)(ActionList);
export default connect(null, mapDispatchToProps)(ActionList);

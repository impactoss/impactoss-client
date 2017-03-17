/*
 *
 * EntityList
 *
 */
import React, { PropTypes } from 'react';

import EntityQuery from 'containers/EntityQuery';
import { updateQueryStringParams } from 'utils/history';

export default class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    location: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    mapToEntityList: PropTypes.func.isRequired,
  }

  getQueryVar = (key) =>
    key in this.props.location.query ? this.props.location.query[key] : null;

  setPage = (page) => {
    updateQueryStringParams({ page });
  }

  setSort = (sortBy, sortOrder) => {
    updateQueryStringParams({ sortBy, sortOrder });
  }

  render() {
    const { page, sortBy, sortOrder } = this.props.location.query;
    const currentPage = parseInt(page || 1, 10);

    return (
      <EntityQuery
        mapToEntityList={this.props.mapToEntityList}
        path={this.props.path}
        currentPage={currentPage}
        onSetPage={this.setPage}
        onSort={this.setSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    );
  }
}

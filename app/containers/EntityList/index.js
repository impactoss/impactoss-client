/*
 *
 * EntityQuery
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateQueryStringParams } from 'utils/history';

import EntityListItem from 'components/EntityListItem';
import Container from 'components/basic/Container';

import {
  loadEntitiesIfNeeded,
} from 'containers/App/actions';
import {
  getEntitiesPaged,
} from 'containers/App/selectors';

export class EntityQuery extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  onSort = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    let sortOrder = this.props.location.query.sortOrder || this.props.sortOrder;
    const sortBy = this.props.location.query.sortBy || this.props.sortBy;
    if (evt.target.value === sortBy) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    updateQueryStringParams({ sortBy, sortOrder });
  }


  nextPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const page = parseInt(this.props.location.query.page || 1, 10) + 1;
    updateQueryStringParams({ page });
  };

  prevPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const page = parseInt(this.props.location.query.page || 1, 10) - 1;
    updateQueryStringParams({ page });
  };

  render() {
    const { entities, havePrevPage, haveNextPage } = this.props.pagedEntities;
    const sortOrder = this.props.location.query.sortOrder || this.props.sortOrder;
    const entitiesList = entities.map(this.props.mapToEntityList);

    return (
      <Container>
        <div>
          {this.onSort &&
            <button onClick={this.onSort} value="id">Sort ID {sortOrder === 'asc' ? 'desc' : 'asc'}</button>
          }
        </div>
        {entitiesList.map((entity, i) =>
          <EntityListItem key={i} {...entity} />
        )}
        {this.prevPage && havePrevPage &&
          <button onClick={this.prevPage}>Previous</button>
        }
        {this.nextPage && haveNextPage &&
          <button onClick={this.nextPage}>Next</button>
        }
      </Container>
    );
  }
}

EntityQuery.propTypes = {
  pagedEntities: PropTypes.shape({
    entities: PropTypes.array.isRequired,
    haveNextPage: PropTypes.boolean,
    havePrevPage: PropTypes.boolean,
  }).isRequired,
  // path: PropTypes.string.isRequired,    only used in mapStateToProps
  mapToEntityList: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  // perPage: PropTypes.number,    only used in mapStateToProps
  // currentPage: PropTypes.number,    only used in mapStateToProps
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
};

EntityQuery.defaultProps = {
  perPage: 5,
  currentPage: 1,
  sortBy: 'id',
  sortOrder: 'desc',
};

const mapStateToProps = (state, props) => {
  const { page, sortBy, sortOrder } = props.location.query;
  const currentPage = parseInt(page || 1, 10);
  return {
    pagedEntities: getEntitiesPaged(state, {
      path: props.path,
      perPage: props.perPage || EntityQuery.defaultProps.perPage,
      currentPage: currentPage || EntityQuery.defaultProps.currentPage,
      sortBy: sortBy || EntityQuery.defaultProps.sortBy,
      sortOrder: sortOrder || EntityQuery.defaultProps.sortOrder,
    }),
  };
};

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded(props.path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityQuery);

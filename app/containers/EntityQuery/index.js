/*
 *
 * EntityQuery
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import EntityListItem from 'components/EntityListItem';
import {
  loadEntitiesIfNeeded,
} from 'containers/App/actions';
import {
  getEntitiesPaged,
} from 'containers/App/selectors';
import messages from './messages';

export class EntityQuery extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    pagedEntities: PropTypes.shape({
      page: PropTypes.array.isRequired,
      haveNextPage: PropTypes.boolean,
      havePrevPage: PropTypes.boolean,
    }).isRequired,
    mapToEntityList: PropTypes.func.isRequired,
    componentWillMount: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    onSetPage: PropTypes.func,
    onSort: PropTypes.func,
    sortOrder: PropTypes.string,
    sortBy: PropTypes.string,
  }

  static defaultProps = {
    perPage: 5,
    currentPage: 1,
    sortBy: 'id',
    sortOrder: 'desc',
  }

  componentWillMount() {
    this.props.componentWillMount();
  }

  onSort = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    const value = evt.target.value;
    let sortOrder = this.props.sortOrder;
    if (value === this.props.sortBy) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    this.props.onSort(value, sortOrder);
  }

  nextPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onSetPage(this.props.currentPage + 1);
  }

  prevPage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onSetPage(this.props.currentPage - 1);
  }

  render() {
    const { sortOrder, pagedEntities } = this.props;
    const { page, havePrevPage, haveNextPage } = pagedEntities;
    const entities = page.map(this.props.mapToEntityList);
    return (
      <div>
        <FormattedMessage {...messages.header} />
        <div>
          {this.props.onSort &&
            <button onClick={this.onSort} value="id">Sort ID {sortOrder === 'asc' ? 'desc' : 'asc'}</button>
          }
        </div>
        {entities.map((entity, i) =>
          <EntityListItem key={i} {...entity} />
        )}
        {this.props.onSetPage && havePrevPage &&
          <button onClick={this.prevPage}>Previous</button>
        }
        {this.props.onSetPage && haveNextPage &&
          <button onClick={this.nextPage}>Next</button>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  pagedEntities: getEntitiesPaged(state, {
    path: props.path,
    perPage: props.perPage || EntityQuery.defaultProps.perPage,
    currentPage: props.currentPage || EntityQuery.defaultProps.currentPage,
    sortBy: props.sortBy || EntityQuery.defaultProps.sortBy,
    sortOrder: props.sortOrder || EntityQuery.defaultProps.sortOrder,
  }),
});

function mapDispatchToProps(dispatch, props) {
  return {
    componentWillMount: () => {
      dispatch(loadEntitiesIfNeeded(props.path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityQuery);

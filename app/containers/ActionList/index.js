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
import EntityList from 'components/EntityList';

import {
  makeEntitiesPagedSelector,
  // sortBySelector,
} from 'containers/App/selectors';

import {
  // actionsPagedSelector,
  sortBySelector,
} from './selectors';


import {
  setSort,
} from './actions';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    componentWillMount: PropTypes.func,
    pagedActions: React.PropTypes.object.isRequired,
    onSetOrder: React.PropTypes.func.isRequired,
    sortBy: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.componentWillMount();
  }

  render() {

    const { page, ...pagingProps } = this.props.pagedActions
    const entities = page.map(({ id, attributes }) => ({
      id,
      title: attributes.title,
      linkTo: `/actions/${id}`,
      reference: id,
      status: attributes.draft ? 'draft' : null,
    }));

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
        <EntityList
          entities={entities}
          {...pagingProps}
          onSort={console.log}
        />
      </div>
    );
  }
}

const entitiesPagedSelector = makeEntitiesPagedSelector();

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    console.log(props);
    return {
      pagedActions: entitiesPagedSelector(state, { path: 'actions', perPage: 20, currentPage: 1, sortBy: 'id', sortOrder: 'desc' }),
      sortBy: sortBySelector(state),
    }
  };
  return mapStateToProps;
};

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

export default connect(makeMapStateToProps(), mapDispatchToProps)(ActionList);

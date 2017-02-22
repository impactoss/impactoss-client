/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import {
  actionsSortedSelector,
  sortBySelector,
} from './selectors';

import {
  setSort,
} from './actions';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.componentWillMount();
  }

  render() {
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
        <select onChange={this.props.onSetOrder} value={this.props.sortBy.order}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        {this.props.actions && this.props.actions.map((list, i) => {
          const { id, attributes } = list;
          const { title, description, draft } = attributes;
          return (
            <span key={i}>
              <Link to={`actions/${id}`}><h5>{title}</h5></Link>
              <ul>
                <li>Description: {description}</li>
                <li>Draft: {draft ? 'YES' : 'NO'}</li>
              </ul>
            </span>
          );
        })}
      </div>
    );
  }
}

ActionList.propTypes = {
  componentWillMount: PropTypes.func,
  actions: React.PropTypes.array,
  onSetOrder: React.PropTypes.func.isRequired,
  sortBy: React.PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  actions: actionsSortedSelector,
  sortBy: sortBySelector,
});

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

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);

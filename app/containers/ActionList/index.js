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

import {
  makeSelectEntities,
} from 'containers/App/selectors';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.componentWillMount();
  }

  render() {
    const { actions } = this.props;
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
        {actions && actions.map((list, i) => {
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
  actions: PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
};

const mapStateToProps = createStructuredSelector({
  actions: makeSelectEntities('actions'),
  // user:
});

function mapDispatchToProps(dispatch) {
  return {
    componentWillMount: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);

/*
 *
 * ActionView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';

import {
  actionSelector,
  notFoundSelector,
} from './selectors';

import { getActionById } from './actions';

import messages from './messages';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentWillMount(this.props.params.id);
  }

  render() {
    const { action, notFound } = this.props;
    return (
      <div>
        <Helmet
          title="Action"
          meta={[
            { name: 'description', content: 'Description of ActionView' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        { notFound &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { !action && !notFound &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { action &&
          <div>
            <h1>{action.attributes.title}</h1>
            <h5>Description</h5>
            <p>{action.attributes.description}</p>
            <h5>Public:</h5>
            <p>{action.attributes.draft === false ? 'YES' : 'NO'}</p>
            <h5>Updated At:</h5>
            <p>{action.attributes['updated-at']}</p>
          </div>
        }
        { action &&
        <Link to={`/actions/edit/${action.id}`}><button>Edit Action</button></Link> }
      </div>
    );
  }
}

ActionView.propTypes = {
  onComponentWillMount: PropTypes.func,
  params: PropTypes.object,
  action: PropTypes.object,
  notFound: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  action: actionSelector,
  notFound: notFoundSelector,
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (id) => {
      dispatch(getActionById(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

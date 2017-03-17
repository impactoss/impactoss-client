/*
 *
 * ActionView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import {
  entitySelect,
  entitiesReadySelector,
} from 'containers/App/selectors';

import messages from './messages';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentWillMount();
  }

  render() {
    const { action, actionsReady } = this.props;

    return (
      <div>
        <Helmet
          title="Action"
          meta={[
            { name: 'description', content: 'Description of ActionView' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        { !action && !actionsReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !action && actionsReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
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
  action: PropTypes.object,
  actionsReady: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  action: entitySelect(
    state,
    {
      id: props.params.id,
      path: 'actions',
      out: 'js',
      extend: {
        type: 'id',
        path: 'users',
        on: 'last_modified_user_id',
        reverse: true,
        as: 'user',
      },
    },
  ),
  actionsReady: entitiesReadySelector(state, { path: 'actions' }),
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

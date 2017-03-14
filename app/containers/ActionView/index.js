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
import EntityView from 'components/EntityView';

import {
  makeEntitySelector,
  makeEntitiesReadySelector,
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
          <EntityView
            type="Action"
            {...action.attributes}
            updatedAt={action.attributes.updated_at}
          />
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

const makeMapStateToProps = () => {
  const getEntity = makeEntitySelector();
  const entitiesReady = makeEntitiesReadySelector();
  const mapStateToProps = (state, props) => ({
    action: getEntity(state, { id: props.params.id, path: 'actions' }),
    actionsReady: entitiesReady(state, { path: 'actions' }),
  });
  return mapStateToProps;
};

function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
    },
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ActionView);

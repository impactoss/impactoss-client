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
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
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
  loadEntitiesIfNeeded: PropTypes.func,
  action: PropTypes.object,
  actionsReady: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  actionsReady: isReady(state, { path: 'measures' }),
  action: getEntity(
    state,
    {
      id: props.params.id,
      path: 'measures',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
  // all categories for all action-taggable taxonomies, listing connection if any
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_measures: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        join: {
          path: 'measure_categories',
          key: 'category_id',
          where: {
            action_id: props.params.id,
          },
        },
      },
      out: 'js',
    },
  ),
  // all recommendations, listing connection if any
  recommendations: getEntities(
    state, {
      path: 'recommendations',
      out: 'js',
      join: {
        path: 'recommendation_measures',
        key: 'recommendation_id',
        where: {
          action_id: props.params.id,
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

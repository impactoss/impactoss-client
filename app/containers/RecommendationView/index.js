/*
 *
 * RecommendationView
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
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class RecommendationView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { recommendation, recommendationsReady } = this.props;
    return (
      <div>
        <Helmet
          title="Recommendation"
          meta={[
            { name: 'description', content: 'Description of RecommendationView' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        { !recommendation && !recommendationsReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !recommendation && recommendationsReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { recommendation &&
          <EntityView
            type="Recommendation"
            {...recommendation.attributes}
            updatedAt={recommendation.attributes.updated_at}
          />
        }
        { recommendation &&
        <Link to={`/recommendations/edit/${recommendation.id}`}><button>Edit Recommendation</button></Link> }
      </div>
    );
  }
}

RecommendationView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  recommendation: PropTypes.object,
  recommendationsReady: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  recommendationsReady: isReady(state, { path: 'recommendations' }),
  recommendation: getEntity(
    state,
    {
      id: props.params.id,
      path: 'recommendations',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
  // all categories for all recommendation-taggable taxonomies, listing connection if any
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_recommendations: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        join: {
          path: 'recommendation_categories',
          key: 'category_id',
          where: {
            recommendation_id: props.params.id,
          },
        },
      },
      out: 'js',
    },
  ),
  // all actions, listing connection if any
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
      join: {
        path: 'recommendation_measures',
        key: 'measure_id',
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
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationView);

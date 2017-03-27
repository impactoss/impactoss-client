/*
 *
 * RecommendationView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Page from 'components/Page';
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

  handleEdit = () => {
    browserHistory.push(`/recommendations/edit/${this.props.params.id}`);
  }

  handleClose = () => {
    browserHistory.push('/recommendations');
    // TODO should be "go back" if history present or to actions list when not
  }

  mapCategoryOptions = (categories) => (
    categories ? Object.values(categories).map((cat) => ({
      value: cat.id,
      label: `${cat.attributes.title} - ${cat.connected}`,
    })) : []
  )

  renderTaxonomies = (taxonomies) => (
    Object.values(taxonomies).map((taxonomy) => ({
      id: taxonomy.attributes.title,
      values: this.mapCategoryOptions(taxonomy.categories),
    }))
  )

  renderActions = (actions) => (
    Object.values(actions)
    .filter((action) => action.connected)
    .map((action) => ({
      id: action.id,
      label: action.attributes.title,
    }))
  )

  render() {
    const { recommendation, dataReady } = this.props;
    const reference = this.props.params.id;
    const status = recommendation && find(PUBLISH_STATUSES, { value: recommendation.attributes.draft });

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !recommendation && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !recommendation && dataReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { recommendation &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Edit',
                onClick: this.handleEdit,
              },
              {
                type: 'primary',
                title: 'Close',
                onClick: this.handleClose,
              },
            ]}
          >
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: recommendation.attributes.title,
                    },
                  ],
                  aside: [
                    {
                      id: 'no',
                      heading: 'No.',
                      value: recommendation.attributes.number.toString(),
                    },
                    {
                      id: 'status',
                      heading: 'Status',
                      value: status && status.label,
                    },
                    {
                      id: 'updated',
                      heading: 'Updated At',
                      value: recommendation.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      heading: 'Updated By',
                      value: recommendation.user && recommendation.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    // {
                    //   id: 'actions',
                    //   heading: 'Actions',
                    //   values: this.renderActions(this.props.actions),
                    // },
                  ],
                  // aside: this.renderTaxonomies(this.props.taxonomies),
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

RecommendationView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  recommendation: PropTypes.object,
  dataReady: PropTypes.bool,
  // taxonomies: PropTypes.object,
  // actions: PropTypes.object,
  params: PropTypes.object,
};

RecommendationView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: 'recommendations' }),
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
        reverse: true,
        where: {
          recommendation_id: props.params.id,
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

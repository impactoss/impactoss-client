/*
 *
 * ActionView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityView from 'components/EntityView';

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

  handleEdit = () => {
    browserHistory.push(`/actions/edit/${this.props.action.id}`);
  }

  handleClose = () => {
    browserHistory.push('/actions');
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

  renderRecommendations = (recommendations) => (
    Object.values(recommendations)
    .filter((recommendation) => recommendation.connected)
    .map((recommendation) => ({
      id: recommendation.id,
      label: recommendation.attributes.title,
    }))
  )

  render() {
    const { action, actionsReady } = this.props;
    const reference = this.props.params.id;
    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
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
                      value: action.attributes.title,
                    },
                  ],
                  aside: [
                    {
                      id: 'no',
                      heading: 'No.',
                      value: reference,
                    },
                    {
                      id: 'status',
                      heading: 'Status',
                      value: action.draft ? 'Draft' : 'Public',
                    },
                    {
                      id: 'updated',
                      heading: 'Updated At',
                      value: action.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      heading: 'Updated By',
                      value: action.user && action.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      heading: 'Description',
                      value: action.attributes.description,
                    },
                    {
                      id: 'recommendations',
                      heading: 'Recommendations',
                      values: this.renderRecommendations(this.props.recommendations),
                    },
                  ],
                  aside: this.renderTaxonomies(this.props.taxonomies),
                },
              }}
            />
          </Page>
        }

      </div>
    );
  }
}

ActionView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  action: PropTypes.object,
  actionsReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  params: PropTypes.object,
};

ActionView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
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
        extend: {
          as: 'assigned',
          path: 'measure_categories',
          key: 'category_id',
          reverse: true,
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
      extend: {
        as: 'connected',
        path: 'recommendation_measures',
        key: 'recommendation_id',
        reverse: true,
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

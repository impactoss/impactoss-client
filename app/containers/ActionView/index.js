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

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  handleEdit = () => {
    browserHistory.push(`/actions/edit/${this.props.params.id}`);
  }

  handleClose = () => {
    browserHistory.push('/actions');
    // TODO should be "go back" if history present or to actions list when not
  }

  mapRecommendations = (recommendations) =>
    Object.values(recommendations).map((recommendation) => ({
      label: recommendation.attributes.title,
      linkTo: `/recommendations/${recommendation.id}`,
    }))

  mapCategoryOptions = (categories) => categories
    ? Object.values(categories).map((cat) => ({
      label: cat.attributes.title,
      linkTo: `/category/${cat.id}`,
    }))
    : []

  renderTaxonomyLists = (taxonomies) =>
    Object.values(taxonomies).map((taxonomy) => ({
      id: taxonomy.id,
      heading: taxonomy.attributes.title,
      type: 'list',
      values: this.mapCategoryOptions(taxonomy.categories),
    }))

  render() {
    const { action, dataReady } = this.props;
    const reference = this.props.params.id;
    const status = action && find(PUBLISH_STATUSES, { value: action.attributes.draft });

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !action && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !action && dataReady &&
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
                      id: 'number',
                      heading: 'Number',
                      value: reference,
                    },
                    {
                      id: 'status',
                      heading: 'Status',
                      value: status && status.label,
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
                      type: 'list',
                      values: this.mapRecommendations(this.props.recommendations),
                    },
                  ],
                  aside: this.renderTaxonomyLists(this.props.taxonomies),
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
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  params: PropTypes.object,
};

ActionView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'taxonomies',
    'categories',
    'recommendations',
    'recommendation_measures',
    'measure_categories',
  ] }),
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
  // all connected categories for all action-taggable taxonomies
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
        connected: {
          path: 'measure_categories',
          key: 'category_id',
          where: {
            measure_id: props.params.id,
          },
        },
      },
      out: 'js',
    },
  ),
  // all connected recommendations
  recommendations: getEntities(
    state, {
      path: 'recommendations',
      out: 'js',
      connected: {
        path: 'recommendation_measures',
        key: 'recommendation_id',
        where: {
          measure_id: props.params.id,
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

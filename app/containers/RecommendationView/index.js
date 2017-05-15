/*
 *
 * RecommendationView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Page from 'components/Page';
import EntityView from 'components/views/EntityView';

import {
  getEntity,
  getEntities,
  isReady,
  isUserManager,
} from 'containers/App/selectors';

import messages from './messages';

export class RecommendationView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  mapActions = (actions) =>
    Object.values(actions).map((action) => ({
      label: action.attributes.title,
      linkTo: `/actions/${action.id}`,
    }))

  mapCategories = (categories) => categories
    ? Object.values(categories).map((cat) => ({
      label: cat.attributes.title,
      linkTo: `/category/${cat.id}`,
    }))
    : []


  renderTaxonomyLists = (taxonomies) => (
    Object.values(taxonomies).map((taxonomy) => ({
      id: taxonomy.id,
      heading: taxonomy.attributes.title,
      type: 'list',
      values: this.mapCategories(taxonomy.categories),
    }))
  )

  render() {
    const { recommendation, dataReady, isManager } = this.props;
    const reference = this.props.params.id;
    const status = recommendation && find(PUBLISH_STATUSES, { value: recommendation.attributes.draft });

    let asideFields = recommendation && [{
      id: 'number',
      heading: 'Number',
      value: recommendation.attributes.number.toString(),
    }];
    if (recommendation && isManager) {
      asideFields = asideFields.concat([
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
      ]);
    }

    const pageActions = isManager
    ? [
      {
        type: 'simple',
        title: 'Edit',
        onClick: this.props.handleEdit,
      },
      {
        type: 'primary',
        title: 'Close',
        onClick: this.props.handleClose,
      },
    ]
    : [{
      type: 'primary',
      title: 'Close',
      onClick: this.props.handleClose,
    }];


    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.pageTitle)}
          actions={pageActions}
        >
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
          { recommendation && dataReady &&
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: recommendation.attributes.title,
                    },
                  ],
                  aside: asideFields,
                },
                body: {
                  main: [
                    {
                      id: 'actions',
                      heading: 'Actions',
                      type: 'list',
                      values: this.mapActions(this.props.actions),
                    },
                  ],
                  aside: this.renderTaxonomyLists(this.props.taxonomies),
                },
              }}
            />
          }
        </Page>
      </div>
    );
  }
}

RecommendationView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  recommendation: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  actions: PropTypes.object,
  params: PropTypes.object,
  isManager: PropTypes.bool,
};

RecommendationView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'recommendations',
    'users',
    'taxonomies',
    'categories',
    'measures',
    'recommendation_measures',
    'recommendation_categories',
  ] }),
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
  // all connected categories for all recommendation-taggable taxonomies
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
        connected: {
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
  // all connected actions
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
      connected: {
        path: 'recommendation_measures',
        key: 'measure_id',
        where: {
          recommendation_id: props.params.id,
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleEdit: () => {
      dispatch(updatePath(`/recommendations/edit/${props.params.id}`));
    },
    handleClose: () => {
      dispatch(updatePath('/recommendations'));
      // TODO should be "go back" if history present or to actions list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationView);

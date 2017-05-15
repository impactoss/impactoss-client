/*
 *
 * ActionView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE, PUBLISH_STATUSES } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  getEntity,
  getEntities,
  isReady,
  isUserManager,
} from 'containers/App/selectors';

import messages from './messages';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  mapIndicators = (indicators) =>
    Object.values(indicators).map((indicator) => ({
      label: indicator.attributes.title,
      linkTo: `/indicators/${indicator.id}`,
    }))

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
    const { action, dataReady, isManager } = this.props;
    const reference = this.props.params.id;
    const status = action && find(PUBLISH_STATUSES, { value: action.attributes.draft });

    let asideFields = action && [{
      id: 'number',
      heading: 'Number',
      value: reference,
    }];
    if (action && isManager) {
      asideFields = asideFields.concat([
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
      ]);
    }

    const buttons = isManager
    ? [
      {
        type: 'edit',
        onClick: () => this.props.handleEdit(this.props.params.id),
      },
      {
        type: 'close',
        onClick: this.props.handleClose,
      },
    ]
    : [{
      type: 'close',
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
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="actions"
            buttons={buttons}
          />
          { !action && !dataReady &&
            <Loading />
          }
          { !action && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { action && dataReady &&
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: action.attributes.title,
                    },
                  ],
                  aside: asideFields,
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
                    {
                      id: 'indicators',
                      heading: 'Indicators',
                      type: 'list',
                      values: this.mapIndicators(this.props.indicators),
                    },
                  ],
                  aside: this.renderTaxonomyLists(this.props.taxonomies),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

ActionView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  action: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  params: PropTypes.object,
};

ActionView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'taxonomies',
    'categories',
    'recommendations',
    'recommendation_measures',
    'measure_categories',
    'indicators',
    'measure_indicators',
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
        reverse: true,
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
  // all connected indicators
  indicators: getEntities(
    state, {
      path: 'indicators',
      out: 'js',
      connected: {
        path: 'measure_indicators',
        key: 'indicator_id',
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
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleEdit: (actionId) => {
      dispatch(updatePath(`/actions/edit/${actionId}`));
    },
    handleClose: () => {
      dispatch(updatePath('/actions'));
      // TODO should be "go back" if history present or to actions list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

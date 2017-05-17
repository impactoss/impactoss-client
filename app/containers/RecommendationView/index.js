/*
 *
 * RecommendationView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

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

import appMessages from 'containers/App/messages';
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

  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          type: 'title',
          value: entity.attributes.title,
          isManager,
        },
      ],
    },
  ]);

  getHeaderAsideFields = (entity, isManager) => {
    if (!isManager) {
      return [
        {
          fields: [
            {
              type: 'referenceStatus',
              fields: [
                {
                  type: 'reference',
                  value: entity.attributes.number.toString(),
                  large: true,
                },
              ],
            },
          ],
        },
      ];
    }
    return [
      {
        fields: [
          {
            type: 'referenceStatus',
            fields: [
              {
                type: 'reference',
                value: entity.id,
              },
              {
                type: 'status',
                value: entity.attributes.draft,
              },
            ],
          },
          {
            type: 'meta',
            fields: [
              {
                label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
                value: this.context.intl.formatDate(new Date(entity.attributes.updated_at)),
              },
              {
                label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
                value: entity.user && entity.user.attributes.name,
              },
            ],
          },
        ],
      },
    ];
  }

  getBodyMainFields = (entity, actions, actionTaxonomies) => ([
    {
      label: 'Connections',
      icon: 'connections',
      fields: [
        {
          type: 'connections',
          label: `${Object.values(actions).length} ${this.context.intl.formatMessage(Object.values(actions).length === 1 ? appMessages.entities.measures.single : appMessages.entities.measures.plural)}`,
          entityType: 'actions',
          values: Object.values(actions),
          icon: 'actions',
          entityPath: '/actions/',
          taxonomies: actionTaxonomies,
          connectionOptions: [{
            label: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
            path: 'recommendations',
          },
          {
            label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
            path: 'indicators',
          }],
        },
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: Object.values(taxonomies).map((taxonomy) => ({
        type: 'list',
        label: this.context.intl.formatMessage(appMessages.entities.taxonomies[taxonomy.id].plural),
        entityType: 'taxonomies',
        id: taxonomy.id,
        values: this.mapCategoryOptions(taxonomy.categories),
        showEmpty: this.context.intl.formatMessage(appMessages.entities.taxonomies[taxonomy.id].empty),
      })),
    },
  ]);
  getFields = (entity, isManager, actions, taxonomies, actionTaxonomies) => ({
    header: {
      main: this.getHeaderMainFields(entity, isManager),
      aside: this.getHeaderAsideFields(entity, isManager),
    },
    body: {
      main: this.getBodyMainFields(entity, actions, actionTaxonomies),
      aside: this.getBodyAsideFields(taxonomies),
    },
  });

  mapActions = (actions) =>
    Object.values(actions).map((action) => ({
      label: action.attributes.title,
      linkTo: `/actions/${action.id}`,
    }))

  mapCategoryOptions = (categories) => categories
    ? Object.values(categories).map((cat) => ({
      label: cat.attributes.title,
      linkTo: `/category/${cat.id}`,
    }))
    : []

  render() {
    const { recommendation, dataReady, isManager, actions, taxonomies, actionTaxonomies } = this.props;
    const buttons = isManager
    ? [
      {
        type: 'edit',
        onClick: this.props.handleEdit,
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
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="indicators"
            buttons={buttons}
          />
          { !recommendation && !dataReady &&
            <Loading />
          }
          { !recommendation && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { recommendation && dataReady &&
            <EntityView
              fields={this.getFields(recommendation, isManager, actions, taxonomies, actionTaxonomies)}
            />
          }
        </Content>
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
  actionTaxonomies: PropTypes.object,
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
    'measure_categories',
    'measure_indicators',
    'indicators',
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
  actionTaxonomies: getEntities(
    state, {
      out: 'js',
      path: 'taxonomies',
      where: {
        tags_measures: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
      },
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
      extend: [
        {
          path: 'measure_categories',
          key: 'measure_id',
          reverse: true,
          as: 'taxonomies',
        },
        {
          path: 'recommendation_measures',
          key: 'measure_id',
          reverse: true,
          as: 'recommendations',
          connected: {
            path: 'recommendations',
            key: 'recommendation_id',
            forward: true,
          },
        },
        {
          path: 'measure_indicators',
          key: 'measure_id',
          reverse: true,
          as: 'indicators',
          connected: {
            path: 'indicators',
            key: 'indicator_id',
            forward: true,
          },
        },
      ],
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
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
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

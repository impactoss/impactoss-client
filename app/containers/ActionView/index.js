/*
 *
 * ActionView
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
  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          type: 'reference',
          value: entity.id,
          large: true,
        },
        {
          type: 'title',
          value: entity.attributes.title,
          isManager,
        },
      ],
    },
  ]);
  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        {
          type: 'status',
          value: entity.attributes.draft,
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
  ]);
  getBodyMainFields = (entity, recommendations, indicators, recTaxonomies, sdgtargets, sdgtargetTaxonomies) => {
    const fields = [];
    if (entity.attributes.description && entity.attributes.description.trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'markdown',
            value: entity.attributes.description,
          },
        ],
      });
    }
    if (entity.attributes.outcome && entity.attributes.outcome.trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'markdown',
            label: this.context.intl.formatMessage(appMessages.attributes.outcome),
            value: entity.attributes.outcome,
          },
        ],
      });
    }
    if (entity.attributes.indicator_summary && entity.attributes.indicator_summary.trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'markdown',
            label: this.context.intl.formatMessage(appMessages.attributes.indicator_summary),
            value: entity.attributes.indicator_summary,
          },
        ],
      });
    }
    const connectionGroup = {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        {
          type: 'connections',
          label: `${Object.values(recommendations).length} ${this.context.intl.formatMessage(Object.values(recommendations).length === 1 ? appMessages.entities.recommendations.single : appMessages.entities.recommendations.plural)}`,
          entityType: 'recommendations',
          values: Object.values(recommendations),
          icon: 'recommendations',
          entityPath: '/recommendations/',
          taxonomies: recTaxonomies,
          showEmpty: this.context.intl.formatMessage(appMessages.entities.recommendations.empty),
          connectionOptions: [
            {
              label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
              path: 'measures', // filter by recommendation connection
            },
          ],
        },
        {
          type: 'connections',
          label: `${Object.values(sdgtargets).length} ${this.context.intl.formatMessage(Object.values(sdgtargets).length === 1 ? appMessages.entities.sdgtargets.single : appMessages.entities.sdgtargets.plural)}`,
          entityType: 'sdgtargets',
          values: Object.values(sdgtargets),
          icon: 'sdgtargets',
          entityPath: '/sdgtargets/',
          taxonomies: sdgtargetTaxonomies,
          showEmpty: this.context.intl.formatMessage(appMessages.entities.sdgtargets.empty),
          connectionOptions: [
            {
              label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
              path: 'measures', // filter by recommendation connection
            },
          ],
        },
        {
          type: 'connections',
          label: `${Object.values(indicators).length} ${this.context.intl.formatMessage(Object.values(indicators).length === 1 ? appMessages.entities.indicators.single : appMessages.entities.indicators.plural)}`,
          entityType: 'indicators',
          values: Object.values(indicators),
          icon: 'indicators',
          entityPath: '/indicators/',
          taxonomies: null,
          showEmpty: this.context.intl.formatMessage(appMessages.entities.indicators.empty),
          connectionOptions: [
            {
              label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
              path: 'measures',
            },
          ],
        },
      ],
    };
    fields.push(connectionGroup);
    return fields;
  };

  getBodyAsideFields = (entity, taxonomies) => {
    const targetDateGroup = [
      {
        type: 'date',
        value: entity.attributes.target_date && this.context.intl.formatDate(new Date(entity.attributes.target_date)),
        label: this.context.intl.formatMessage(appMessages.attributes.target_date),
        showEmpty: this.context.intl.formatMessage(appMessages.attributes.targetDateEmpty),
      },
    ];
    if (entity.attributes.target_date_comment && entity.attributes.target_date_comment.trim().length > 0) {
      targetDateGroup.push({
        type: 'text',
        value: entity.attributes.target_date_comment,
        label: this.context.intl.formatMessage(appMessages.attributes.target_date_comment),
      });
    }
    return [ // fieldGroups
      {
        type: 'dark',
        fields: targetDateGroup,
      },
      { // fieldGroup
        label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
        icon: 'categories',
        fields: Object.values(taxonomies).map((taxonomy) => ({
          type: 'list',
          label: this.context.intl.formatMessage(appMessages.entities.taxonomies[taxonomy.id].plural),
          entityType: 'taxonomies',
          id: taxonomy.id,
          values: this.mapCategoryOptions(taxonomy.categories),
        })),
      },
    ];
  };

  getFields = (entity, isManager, recommendations, indicators, taxonomies, recTaxonomies, sdgtargets, sdgtargetTaxonomies) => ({
    header: {
      main: this.getHeaderMainFields(entity, isManager),
      aside: isManager ? this.getHeaderAsideFields(entity) : null,
    },
    body: {
      main: this.getBodyMainFields(entity, recommendations, indicators, recTaxonomies, sdgtargets, sdgtargetTaxonomies),
      aside: this.getBodyAsideFields(entity, taxonomies),
    },
  });

  mapCategoryOptions = (categories) => categories
    ? Object.values(categories).map((cat) => ({
      label: cat.attributes.title,
      linkTo: `/category/${cat.id}`,
    }))
    : []

  render() {
    const {
      action,
      dataReady,
      isManager,
      recommendations,
      indicators,
      taxonomies,
      recTaxonomies,
      sdgtargets,
      sdgtargetTaxonomies,
    } = this.props;

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
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
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
              fields={this.getFields(action, isManager, recommendations, indicators, taxonomies, recTaxonomies, sdgtargets, sdgtargetTaxonomies)}
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
  recTaxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
  sdgtargetTaxonomies: PropTypes.object,
  params: PropTypes.object,
};

ActionView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'measures',
    'measure_categories',
    'measure_indicators',
    'users',
    'taxonomies',
    'categories',
    'indicators',
    'recommendations',
    'recommendation_categories',
    'recommendation_measures',
    'sdgtargets',
    'sdgtarget_indicators',
    'sdgtarget_measures',
    'sdgtarget_categories',
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
  recTaxonomies: getEntities(
    state, {
      out: 'js',
      path: 'taxonomies',
      where: {
        tags_recommendations: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
      },
    },
  ),
  sdgtargetTaxonomies: getEntities(
    state, {
      out: 'js',
      path: 'taxonomies',
      where: {
        tags_sdgtargets: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
      },
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
      extend: [
        {
          path: 'recommendation_categories',
          key: 'recommendation_id',
          reverse: true,
          as: 'taxonomies',
        },
        {
          path: 'recommendation_measures',
          key: 'recommendation_id',
          reverse: true,
          as: 'measures',
          connected: {
            path: 'measures',
            key: 'measure_id',
            forward: true,
          },
        },
      ],
    },
  ),
  sdgtargets: getEntities(
    state, {
      path: 'sdgtargets',
      out: 'js',
      connected: {
        path: 'sdgtarget_measures',
        key: 'sdgtarget_id',
        where: {
          measure_id: props.params.id,
        },
      },
      extend: [
        {
          path: 'sdgtarget_categories',
          key: 'sdgtarget_id',
          reverse: true,
          as: 'taxonomies',
        },
        {
          path: 'sdgtarget_measures',
          key: 'sdgtarget_id',
          reverse: true,
          as: 'measures',
          connected: {
            path: 'measures',
            key: 'measure_id',
            forward: true,
          },
        },
        {
          path: 'sdgtarget_indicators',
          key: 'sdgtarget_id',
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
      extend: [
        {
          path: 'measure_indicators',
          key: 'indicator_id',
          reverse: true,
          as: 'measures',
          connected: {
            path: 'measures',
            key: 'measure_id',
            forward: true,
          },
        },
        {
          path: 'sdgtarget_indicators',
          key: 'indicator_id',
          reverse: true,
          as: 'sdgtargets',
          connected: {
            path: 'sdgtargets',
            key: 'sdgtarget_id',
            forward: true,
          },
        },
      ],
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
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_indicators'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_measures'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
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

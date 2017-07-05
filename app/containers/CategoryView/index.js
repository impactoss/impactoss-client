/*
 *
 * CategoryView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { CONTENT_SINGLE } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

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

export class CategoryView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  getHeaderMainFields = (entity, isManager) => {
    const fields = [];

    if (entity.attributes.reference && entity.attributes.reference.trim() !== '') {
      fields.push({
        type: 'reference',
        value: entity.attributes.reference,
        large: true,
        label: isManager ? this.context.intl.formatMessage(appMessages.attributes.id) : null,
      });
    }
    fields.push({
      type: 'title',
      value: entity.attributes.title,
      isManager,
    });
    fields.push({
      type: 'short_title',
      value: this.getCategoryShortTitle(entity),
      taxonomyId: entity.attributes.taxonomy_id,
    });
    return { fields };
  };

  getHeaderAsideFields = (entity, isManager) => !isManager
    ? null
    : [
      {
        fields: [
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

  getBodyMainFields = (entity, recommendations, measures, taxonomies, sdgtargets) => {
    const fields = [];
    if (entity.attributes.description && entity.attributes.description.trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'description',
            value: entity.attributes.description,
          },
        ],
      });
    }
    const connectionGroup = {
      label: 'Connections',
      icon: 'connections',
      fields: [],
    };
    if (entity.taxonomy.attributes.tags_recommendations) {
      connectionGroup.fields.push({
        type: 'connections',
        label: `${Object.values(recommendations).length} ${this.context.intl.formatMessage(Object.values(recommendations).length === 1 ? appMessages.entities.recommendations.single : appMessages.entities.recommendations.plural)}`,
        entityType: 'recommendations',
        values: Object.values(recommendations),
        icon: 'recommendations',
        entityPath: '/recommendations/',
        taxonomies,
        connectionOptions: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
            path: 'measures',
          },
        ],
      });
    }
    if (entity.taxonomy.attributes.tags_measures) {
      connectionGroup.fields.push({
        type: 'connections',
        label: `${Object.values(measures).length} ${this.context.intl.formatMessage(Object.values(measures).length === 1 ? appMessages.entities.measures.single : appMessages.entities.measures.plural)}`,
        entityType: 'measures',
        values: Object.values(measures),
        icon: 'measures',
        entityPath: '/actions/',
        taxonomies,
        connectionOptions: [{
          label: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
          path: 'recommendations',
        },
        {
          label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
          path: 'indicators',
        }],
      });
    }
    if (entity.taxonomy.attributes.tags_sdgtargets) {
      connectionGroup.fields.push({
        type: 'connections',
        label: `${Object.values(sdgtargets).length} ${this.context.intl.formatMessage(Object.values(sdgtargets).length === 1 ? appMessages.entities.sdgtargets.single : appMessages.entities.sdgtargets.plural)}`,
        entityType: 'sdgtargets',
        values: Object.values(sdgtargets),
        icon: 'sdgtargets',
        entityPath: '/sdgtargets/',
        taxonomies,
        connectionOptions: [{
          label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
          path: 'indicators',
        }],
      });
    }
    fields.push(connectionGroup);
    return fields;
  };

  getBodyAsideFields = (entity, isManager) => {
    const fields = [];
    if (entity.attributes.url && entity.attributes.url.trim().length > 0) {
      fields.push({
        type: 'dark',
        fields: [
          {
            type: 'link',
            value: entity.attributes.url,
            anchor: this.getCategoryAnchor(entity.attributes.url),
          },
        ],
      });
    }
    if (isManager && !!entity.taxonomy.attributes.has_manager) {
      fields.push({
        type: 'dark',
        fields: [{
          type: 'manager',
          value: entity.manager && entity.manager.attributes.name,
          showEmpty: this.context.intl.formatMessage(appMessages.attributes.manager_id.categoriesEmpty),
        }],
      });
    }
    return fields;
  }

  getFields = (entity, isManager, recommendations, measures, taxonomies, sdgtargets) => ({
    header: {
      main: this.getHeaderMainFields(entity, isManager),
      aside: this.getHeaderAsideFields(entity, isManager),
    },
    body: {
      main: this.getBodyMainFields(entity, recommendations, measures, taxonomies, sdgtargets),
      aside: this.getBodyAsideFields(entity, isManager),
    },
  });

  getCategoryShortTitle = (category) => {
    const title = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
      ? category.attributes.short_title
      : category.attributes.title);
    return title.length > 10 ? `${title.substring(0, 10)}...` : title;
  }
  getCategoryAnchor = (url) => {
    const urlNoProtocol = url.replace(/^https?:\/\//i, '');
    return urlNoProtocol.length > 40
      ? `${urlNoProtocol.substring(0, 40)}...`
      : urlNoProtocol;
  }
  render() {
    const { category, dataReady, isManager, recommendations, measures, taxonomies, sdgtargets } = this.props;

    const buttons = dataReady && isManager
    ? [
      {
        type: 'edit',
        onClick: () => this.props.handleEdit(this.props.params.id),
      },
      {
        type: 'close',
        onClick: () => this.props.handleClose(this.props.category.taxonomy.id),
      },
    ]
    : [{
      type: 'close',
      onClick: () => this.props.handleClose(this.props.category.taxonomy.id),
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
            icon="categories"
            buttons={buttons}
          />
          { !category && !dataReady &&
            <Loading />
          }
          { !category && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { category && dataReady &&
            <EntityView fields={this.getFields(category, isManager, recommendations, measures, taxonomies, sdgtargets)} />
          }
        </Content>
      </div>
    );
  }
}

CategoryView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  category: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  measures: PropTypes.object,
  recommendations: PropTypes.object,
  taxonomies: PropTypes.object,
  sdgtargets: PropTypes.object,
};

CategoryView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'categories',
    'users',
    'user_roles',
    'taxonomies',
    'recommendations',
    'recommendation_measures',
    'recommendation_categories',
    'measures',
    'measure_indicators',
    'measure_categories',
    'sdgtargets',
    'sdgtarget_indicators',
    'sdgtarget_categories',
    'indicators',
  ] }),
  category: getEntity(
    state,
    {
      id: props.params.id,
      path: 'categories',
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
        {
          type: 'single',
          path: 'users',
          key: 'manager_id',
          as: 'manager',
        },
        {
          type: 'single',
          path: 'taxonomies',
          key: 'taxonomy_id',
          as: 'taxonomy',
        },
      ],
    },
  ),
  recommendations: getEntities(
    state, {
      path: 'recommendations',
      out: 'js',
      connected: {
        path: 'recommendation_categories',
        key: 'recommendation_id',
        where: {
          category_id: props.params.id,
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
  // all connected measures
  measures: getEntities(
    state, {
      path: 'measures',
      out: 'js',
      connected: {
        path: 'measure_categories',
        key: 'measure_id',
        where: {
          category_id: props.params.id,
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
  // all connected measures
  sdgtargets: getEntities(
    state, {
      path: 'sdgtargets',
      out: 'js',
      connected: {
        path: 'sdgtarget_categories',
        key: 'sdgtarget_id',
        where: {
          category_id: props.params.id,
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
  taxonomies: getEntities(
    state, {
      out: 'js',
      path: 'taxonomies',
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_indicators'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleEdit: (categoryId) => {
      dispatch(updatePath(`/category/edit/${categoryId}`));
    },
    handleClose: (taxonomyId) => {
      dispatch(updatePath(`/categories/${taxonomyId}`));
      // TODO should be "go back" if history present or to categories list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);

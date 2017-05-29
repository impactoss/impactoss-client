/*
 *
 * SdgTargetView
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

export class SdgTargetView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
                  value: entity.attributes.reference.toString(),
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
                value: entity.attributes.reference,
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
  getBodyMainFields = (entity, indicators) => {
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
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
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
              label: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
              path: 'sdgtargets',
            },
          ],
        },
      ],
    };
    fields.push(connectionGroup);
    return fields;
  };

  getBodyAsideFields = (entity, taxonomies) => ([ // fieldGroups
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
  ]);

  getFields = (entity, isManager, indicators, taxonomies) => ({
    header: {
      main: this.getHeaderMainFields(entity, isManager),
      aside: this.getHeaderAsideFields(entity, isManager),
    },
    body: {
      main: this.getBodyMainFields(entity, indicators),
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
      sdgtarget,
      dataReady,
      isManager,
      indicators,
      taxonomies,
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
            icon="sdgtargets"
            buttons={buttons}
          />
          { !sdgtarget && !dataReady &&
            <Loading />
          }
          { !sdgtarget && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { sdgtarget && dataReady &&
            <EntityView
              fields={this.getFields(sdgtarget, isManager, indicators, taxonomies)}
            />
          }
        </Content>
      </div>
    );
  }
}

SdgTargetView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  sdgtarget: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  taxonomies: PropTypes.object,
  indicators: PropTypes.object,
  params: PropTypes.object,
};

SdgTargetView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'sdgtargets',
    'users',
    'taxonomies',
    'categories',
    'sdgtarget_categories',
    'indicators',
    'sdgtarget_indicators',
  ] }),
  sdgtarget: getEntity(
    state,
    {
      id: props.params.id,
      path: 'sdgtargets',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
  // all connected categories for all sdgtarget-taggable taxonomies
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_sdgtargets: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        connected: {
          path: 'sdgtarget_categories',
          key: 'category_id',
          where: {
            sdgtarget_id: props.params.id,
          },
        },
      },
      out: 'js',
    },
  ),
  // all connected indicators
  indicators: getEntities(
    state, {
      path: 'indicators',
      out: 'js',
      connected: {
        path: 'sdgtarget_indicators',
        key: 'indicator_id',
        where: {
          sdgtarget_id: props.params.id,
        },
      },
      extend: [
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
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_indicators'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleEdit: (sdgtargetId) => {
      dispatch(updatePath(`/sdgtargets/edit/${sdgtargetId}`));
    },
    handleClose: () => {
      dispatch(updatePath('/sdgtargets'));
      // TODO should be "go back" if history present or to sdgtargets list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetView);

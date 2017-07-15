/*
 *
 * ActionView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
  isReady,
  isUserManager,
  selectRecommendationTaxonomies,
  selectSdgTargetTaxonomies,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
  selectRecommendations,
  selectIndicators,
  selectSdgTargets,
} from './selectors';

import { DEPENDENCIES } from './constants';

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
          value: entity.get('id'),
          large: true,
        },
        {
          type: 'title',
          value: entity.getIn(['attributes', 'title']),
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
          value: entity.getIn(['attributes', 'draft']),
        },
        {
          type: 'meta',
          fields: [
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
              value: this.context.intl.formatDate(new Date(entity.getIn(['attributes', 'updated_at']))),
            },
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
              value: entity.get('user') && entity.get(['user', 'attributes', 'name']),
            },
          ],
        },
      ],
    },
  ]);
  getBodyMainFields = (entity, recommendations, indicators, recTaxonomies, sdgtargets, sdgtargetTaxonomies) => {
    const fields = [];
    if (entity.getIn(['attributes', 'description']) && entity.getIn(['attributes', 'description']).trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'markdown',
            value: entity.getIn(['attributes', 'description']),
          },
        ],
      });
    }
    if (entity.getIn(['attributes', 'outcome']) && entity.getIn(['attributes', 'outcome']).trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'markdown',
            label: this.context.intl.formatMessage(appMessages.attributes.outcome),
            value: entity.getIn(['attributes', 'outcome']),
          },
        ],
      });
    }
    if (entity.getIn(['attributes', 'indicator_summary']) && entity.getIn(['attributes', 'indicator_summary']).trim().length > 0) {
      fields.push({
        fields: [
          {
            type: 'markdown',
            label: this.context.intl.formatMessage(appMessages.attributes.indicator_summary),
            value: entity.getIn(['attributes', 'indicator_summary']),
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
          label: `${indicators.size} ${this.context.intl.formatMessage(indicators.size === 1 ? appMessages.entities.indicators.single : appMessages.entities.indicators.plural)}`,
          entityType: 'indicators',
          values: indicators.toList(),
          icon: 'indicators',
          entityPath: '/indicators/',
          taxonomies: null,
          showEmpty: this.context.intl.formatMessage(appMessages.entities.indicators.empty),
          connectionOptions: [
            {
              label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
              path: 'measures',
            },
            {
              label: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
              path: 'sdgtargets',
            },
          ],
        },
        {
          type: 'connections',
          label: `${recommendations.size} ${this.context.intl.formatMessage(recommendations.size === 1 ? appMessages.entities.recommendations.single : appMessages.entities.recommendations.plural)}`,
          entityType: 'recommendations',
          values: recommendations.toList(),
          icon: 'recommendations',
          entityPath: '/recommendations/',
          taxonomies: recTaxonomies,
          showEmpty: this.context.intl.formatMessage(appMessages.entities.recommendations.empty),
          connectionOptions: [
            {
              label: 'entities.measures.plural',
              path: 'measures',
            },
          ],
        },
        {
          type: 'connections',
          label: `${sdgtargets.size} ${this.context.intl.formatMessage(sdgtargets.size === 1 ? appMessages.entities.sdgtargets.single : appMessages.entities.sdgtargets.plural)}`,
          entityType: 'sdgtargets',
          values: sdgtargets.toList(),
          icon: 'sdgtargets',
          entityPath: '/sdgtargets/',
          taxonomies: sdgtargetTaxonomies,
          showEmpty: this.context.intl.formatMessage(appMessages.entities.sdgtargets.empty),
          connectionOptions: [
            {
              label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
              path: 'measures',
            },
            {
              label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
              path: 'indicators',
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
        value: entity.getIn(['attributes', 'target_date']) && this.context.intl.formatDate(new Date(entity.getIn(['attributes', 'target_date']))),
        label: this.context.intl.formatMessage(appMessages.attributes.target_date),
        showEmpty: this.context.intl.formatMessage(appMessages.attributes.targetDateEmpty),
      },
    ];
    if (entity.getIn(['attributes', 'target_date_comment']) && entity.getIn(['attributes', 'target_date_Comment']).trim().length > 0) {
      targetDateGroup.push({
        type: 'text',
        value: entity.getIn(['attributes', 'target_date_comment']),
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
        fields: taxonomies && taxonomies.map((taxonomy) => ({
          type: 'list',
          label: this.context.intl.formatMessage(appMessages.entities.taxonomies[taxonomy.get('id')].plural),
          entityType: 'taxonomies',
          id: taxonomy.get('id'),
          values: this.mapCategoryOptions(taxonomy.get('categories')),
        })).toArray(),
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
    ? categories.map((cat) => ({
      label: cat.getIn(['attributes', 'title']),
      linkTo: `/category/${cat.get('id')}`,
    })).toArray()
    : [];

  render() {
    const {
      viewEntity,
      dataReady,
      isManager,
      recommendations,
      indicators,
      taxonomies,
      recTaxonomies,
      sdgtargets,
      sdgtargetTaxonomies,
    } = this.props;
    // viewEntity && console.log(viewEntity.toJS())
    // recommendations && console.log(recommendations.toJS())

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
            icon="measures"
            buttons={buttons}
          />
          { !viewEntity && !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { viewEntity && dataReady &&
            <EntityView
              fields={this.getFields(viewEntity, isManager, recommendations, indicators, taxonomies, recTaxonomies, sdgtargets, sdgtargetTaxonomies)}
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
  viewEntity: PropTypes.object,
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
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  recommendations: selectRecommendations(state, props.params.id),
  recTaxonomies: selectRecommendationTaxonomies(state),
  sdgtargetTaxonomies: selectSdgTargetTaxonomies(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: (measureId) => {
      dispatch(updatePath(`/actions/edit/${measureId}`));
    },
    handleClose: () => {
      dispatch(updatePath('/actions'));
      // TODO should be "go back" if history present or to actions list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

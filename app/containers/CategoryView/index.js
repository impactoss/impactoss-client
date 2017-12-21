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

import {
  getReferenceField,
  getTitleField,
  getCategoryShortTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getLinkField,
  getMeasureConnectionField,
  getRecommendationConnectionField,
  getSdgTargetConnectionField,
  getManagerField,
} from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectMeasureConnections,
  selectSdgTargetConnections,
  selectRecommendationConnections,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectRecommendations,
  selectMeasures,
  selectSdgTargets,
  selectTaxonomies,
} from './selectors';

import { DEPENDENCIES } from './constants';

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
  getHeaderMainFields = (entity, isManager) => ([
    { // fieldGroup
      fields: [
        getReferenceField(entity, isManager),
        getTitleField(entity, isManager),
        getCategoryShortTitleField(entity, isManager),
      ],
    },
  ]);
  getHeaderAsideFields = (entity, isManager) => {
    const fields = []; // fieldGroups
    if (isManager) {
      fields.push({
        fields: [
          getStatusField(entity),
          getMetaField(entity, appMessages),
        ],
      });
    }
    if (entity.getIn(['taxonomy', 'attributes', 'tags_users']) && entity.getIn(['attributes', 'user_only'])) {
      fields.push({
        type: 'dark',
        fields: [{
          type: 'text',
          value: this.context.intl.formatMessage(appMessages.textValues.user_only),
          label: appMessages.attributes.user_only,
        }],
      });
    }
    return fields;
  }

  getBodyMainFields = (
    entity,
    recommendations,
    measures,
    taxonomies,
    sdgtargets,
    onEntityClick,
    sdgtargetConnections,
    measureConnections,
    recommendationConnections
  ) => {
    const fields = [];
    fields.push({
      fields: [getMarkdownField(entity, 'description', true, appMessages)],
    });
    if (!entity.getIn(['attributes', 'user_only'])) {
      fields.push({
        label: appMessages.entities.connections.plural,
        icon: 'connections',
        fields: [
          entity.getIn(['taxonomy', 'attributes', 'tags_measures']) && measures &&
            getMeasureConnectionField(measures, taxonomies, measureConnections, appMessages, onEntityClick),
          entity.getIn(['taxonomy', 'attributes', 'tags_sdgtargets']) && sdgtargets &&
            getSdgTargetConnectionField(sdgtargets, taxonomies, sdgtargetConnections, appMessages, onEntityClick),
          entity.getIn(['taxonomy', 'attributes', 'tags_recommendations']) && recommendations &&
            getRecommendationConnectionField(recommendations, taxonomies, recommendationConnections, appMessages, onEntityClick),
        ],
      });
    }
    return fields;
  };

  getBodyAsideFields = (entity, isManager) => {
    const fields = [];
    if (entity.getIn(['attributes', 'url']) && entity.getIn(['attributes', 'url']).trim().length > 0) {
      fields.push({
        type: 'dark',
        fields: [getLinkField(entity)],
      });
    }
    if (isManager && !!entity.getIn(['taxonomy', 'attributes', 'has_manager'])) {
      fields.push({
        type: 'dark',
        fields: [getManagerField(
          entity,
          appMessages.attributes.manager_id.categories,
          appMessages.attributes.manager_id.categoriesEmpty
        )],
      });
    }
    return fields;
  };

  getTaxTitle = (id) => this.context.intl.formatMessage(appMessages.entities.taxonomies[id].single);

  render() {
    const {
      viewEntity,
      dataReady,
      isManager,
      recommendations,
      measures,
      taxonomies,
      sdgtargets,
      onEntityClick,
      sdgtargetConnections,
      measureConnections,
      recommendationConnections,
    } = this.props;

    let buttons = [];
    if (dataReady) {
      buttons = isManager
      ? [
        {
          type: 'edit',
          onClick: () => this.props.handleEdit(this.props.params.id),
        },
        {
          type: 'close',
          onClick: () => this.props.handleClose(this.props.viewEntity.getIn(['taxonomy', 'id'])),
        },
      ]
      : [{
        type: 'close',
        onClick: () => this.props.handleClose(this.props.viewEntity.getIn(['taxonomy', 'id'])),
      }];
    }

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (viewEntity && viewEntity.get('taxonomy')) {
      pageTitle = this.getTaxTitle(viewEntity.getIn(['taxonomy', 'id']));
    }

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
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={buttons}
          />
          { !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { viewEntity && dataReady &&
            <EntityView
              fields={{
                header: {
                  main: this.getHeaderMainFields(viewEntity, isManager),
                  aside: this.getHeaderAsideFields(viewEntity, isManager),
                },
                body: {
                  main: this.getBodyMainFields(
                    viewEntity,
                    recommendations,
                    measures,
                    taxonomies,
                    sdgtargets,
                    onEntityClick,
                    sdgtargetConnections,
                    measureConnections,
                    recommendationConnections
                  ),
                  aside: this.getBodyAsideFields(viewEntity, isManager),
                },
              }}
            />
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
  onEntityClick: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  recommendations: PropTypes.object,
  taxonomies: PropTypes.object,
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  measureConnections: PropTypes.object,
  sdgtargetConnections: PropTypes.object,
  recommendationConnections: PropTypes.object,
};

CategoryView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  recommendations: selectRecommendations(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  taxonomies: selectTaxonomies(state),
  measureConnections: selectMeasureConnections(state),
  sdgtargetConnections: selectSdgTargetConnections(state),
  recommendationConnections: selectRecommendationConnections(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: (categoryId) => {
      dispatch(updatePath(`${PATHS.CATEGORIES}${PATHS.EDIT}/${categoryId}`, { replace: true }));
    },
    handleClose: (taxonomyId) => {
      dispatch(closeEntity(`${PATHS.TAXONOMIES}/${taxonomyId}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);

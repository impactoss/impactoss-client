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

import {
  getIdField,
  getTitleField,
  getTextField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getDateField,
  getIndicatorConnectionField,
  getRecommendationConnectionField,
  getSdgTargetConnectionField,
  getTaxonomyFields,
} from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectRecommendationTaxonomies,
  selectSdgTargetTaxonomies,
  selectRecommendationConnections,
  selectSdgTargetConnections,
  selectIndicatorConnections,
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
        getIdField(entity),
        getTitleField(entity, isManager),
      ],
    },
  ]);
  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(entity),
        getMetaField(entity, appMessages),
      ],
    },
  ]);
  getBodyMainFields = (
    entity,
    recommendations,
    indicators,
    recTaxonomies,
    sdgtargets,
    sdgtargetTaxonomies,
    onEntityClick,
    recConnections,
    indicatorConnections,
    sdgtargetConnections,
  ) => ([
    {
      fields: [
        getMarkdownField(entity, 'description', true, appMessages),
        getMarkdownField(entity, 'outcome', true, appMessages),
        getMarkdownField(entity, 'indicator_summary', true, appMessages),
      ],
    },
    {
      label: appMessages.entities.connections.plural,
      icon: 'connections',
      fields: [
        getIndicatorConnectionField(indicators, indicatorConnections, appMessages, onEntityClick),
        getRecommendationConnectionField(recommendations, recTaxonomies, recConnections, appMessages, onEntityClick),
        getSdgTargetConnectionField(sdgtargets, sdgtargetTaxonomies, sdgtargetConnections, appMessages, onEntityClick),
      ],
    },
  ]);

  getBodyAsideFields = (entity, taxonomies) => ([
    // fieldGroup
    {
      type: 'dark',
      fields: [
        getDateField(entity, 'target_date', appMessages, true),
        getTextField(entity, 'target_date_comment', appMessages),
      ],
    },
    { // fieldGroup
      label: appMessages.entities.taxonomies.plural,
      icon: 'categories',
      fields: getTaxonomyFields(taxonomies, appMessages),
    },
  ]);


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
      onEntityClick,
      recConnections,
      sdgtargetConnections,
      indicatorConnections,
    } = this.props;
    // viewEntity && console.log(viewEntity.toJS())
    // indicators && console.log(indicators.toJS())
    // console.log('ActionView.render', dataReady)
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
                  aside: isManager ? this.getHeaderAsideFields(viewEntity) : null,
                },
                body: {
                  main: this.getBodyMainFields(
                    viewEntity,
                    recommendations,
                    indicators,
                    recTaxonomies,
                    sdgtargets,
                    sdgtargetTaxonomies,
                    onEntityClick,
                    recConnections,
                    indicatorConnections,
                    sdgtargetConnections,
                  ),
                  aside: this.getBodyAsideFields(viewEntity, taxonomies),
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
  onEntityClick: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  taxonomies: PropTypes.object,
  recTaxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
  sdgtargetTaxonomies: PropTypes.object,
  recConnections: PropTypes.object,
  sdgtargetConnections: PropTypes.object,
  indicatorConnections: PropTypes.object,
  params: PropTypes.object,
};

ActionView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  recommendations: selectRecommendations(state, props.params.id),
  recTaxonomies: selectRecommendationTaxonomies(state),
  sdgtargetTaxonomies: selectSdgTargetTaxonomies(state),
  recConnections: selectRecommendationConnections(state),
  sdgtargetConnections: selectSdgTargetConnections(state),
  indicatorConnections: selectIndicatorConnections(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: (measureId) => {
      dispatch(updatePath(`/actions/edit/${measureId}`));
    },
    handleClose: () => {
      dispatch(closeEntity('/actions'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

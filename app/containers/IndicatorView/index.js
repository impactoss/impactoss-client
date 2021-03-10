/*
 *
 * IndicatorView
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
  getStatusField,
  getMetaField,
  getMarkdownField,
  getMeasureConnectionField,
  getRecommendationConnectionField,
  getManagerField,
  getScheduleField,
  getReportsField,
} from 'utils/fields';

import { qe } from 'utils/quasi-equals';
import { getEntityTitleTruncated, getEntityReference } from 'utils/entities';

import {
  loadEntitiesIfNeeded, updatePath, closeEntity, dismissQueryMessages,
} from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserContributor,
  selectIsUserManager,
  selectMeasureTaxonomies,
  selectMeasureConnections,
  selectRecommendationTaxonomies,
  selectRecommendationConnections,
  selectQueryMessages,
  selectActiveFrameworks,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectMeasures,
  selectRecommendations,
  selectReports,
  selectDueDates,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class IndicatorView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceField(entity, isManager, true),
        getTitleField(entity, isManager),
      ],
    },
  ]);

  getHeaderAsideFields = (entity, isContributor) => isContributor
    && ([{
      fields: [
        getStatusField(entity),
        getMetaField(entity),
      ],
    }]);

  getBodyMainFields = (
    entity,
    measures,
    reports,
    measureTaxonomies,
    isContributor,
    onEntityClick,
    measureConnections,
    recommendationsByFw,
    recommendationTaxonomies,
    recommendationConnections,
    frameworks,
  ) => {
    const { intl } = this.context;
    const fields = [];
    // own attributes
    fields.push({
      fields: [
        getMarkdownField(entity, 'description', true),
        getReportsField(
          reports,
          {
            type: 'add',
            title: intl.formatMessage(messages.addReport),
            onClick: this.props.handleNewReport,
          }
        ),
      ],
    });
    // measures
    if (measures) {
      fields.push({
        label: appMessages.nav.measuresSuper,
        icon: 'measures',
        fields: [
          getMeasureConnectionField(
            measures,
            measureTaxonomies,
            measureConnections,
            onEntityClick,
          ),
        ],
      });
    }
    // recs
    if (recommendationsByFw) {
      const recConnections = [];
      recommendationsByFw.forEach((recs, fwid) => {
        const framework = frameworks.find((fw) => qe(fw.get('id'), fwid));
        const hasResponse = framework && framework.getIn(['attributes', 'has_response']);
        recConnections.push(
          getRecommendationConnectionField(
            recs,
            recommendationTaxonomies,
            recommendationConnections,
            onEntityClick,
            fwid,
            hasResponse,
          ),
        );
      });
      fields.push({
        label: appMessages.nav.recommendationsSuper,
        icon: 'recommendations',
        fields: recConnections,
      });
    }
    return fields;
  };

  getBodyAsideFields = (entity, dates) => ([ // fieldGroups
    { // fieldGroup
      label: appMessages.entities.due_dates.schedule,
      type: 'dark',
      icon: 'reminder',
      fields: [
        getScheduleField(dates),
        getManagerField(
          entity,
          appMessages.attributes.manager_id.indicators,
          appMessages.attributes.manager_id.indicatorsEmpty
        ),
      ],
    },
  ]);

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      isContributor,
      isManager,
      measures,
      reports,
      dates,
      measureTaxonomies,
      onEntityClick,
      measureConnections,
      recommendationsByFw,
      recommendationTaxonomies,
      recommendationConnections,
      frameworks,
    } = this.props;
    let buttons = [];
    if (dataReady) {
      buttons.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
      buttons = isManager
        ? buttons.concat([
          {
            type: 'text',
            title: intl.formatMessage(messages.addReport),
            onClick: this.props.handleNewReport,
          },
          {
            type: 'edit',
            onClick: () => this.props.handleEdit(this.props.params.id),
          },
          {
            type: 'close',
            onClick: this.props.handleClose,
          },
        ])
        : buttons.concat([
          {
            type: 'text',
            title: intl.formatMessage(messages.addReport),
            onClick: this.props.handleNewReport,
          },
          {
            type: 'close',
            onClick: this.props.handleClose,
          },
        ]);
    }

    const pageTitle = intl.formatMessage(messages.pageTitle);
    const metaTitle = viewEntity
      ? `${pageTitle} ${getEntityReference(viewEntity)}: ${getEntityTitleTruncated(viewEntity)}`
      : `${pageTitle} ${this.props.params.id}`;

    return (
      <div>
        <Helmet
          title={metaTitle}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="indicators"
            buttons={buttons}
          />
          { !viewEntity && dataReady
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {this.props.queryMessages.info && appMessages.entities[this.props.queryMessages.infotype]
            && (
              <Messages
                spaceMessage
                type="success"
                onDismiss={this.props.onDismissQueryMessages}
                messageKey={this.props.queryMessages.info}
                messageArgs={{
                  entityType: intl.formatMessage(appMessages.entities[this.props.queryMessages.infotype].single),
                }}
              />
            )
          }
          { !dataReady
            && <Loading />
          }
          { viewEntity && dataReady
            && (
              <EntityView
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity, isContributor),
                    aside: this.getHeaderAsideFields(viewEntity, isContributor),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      measures,
                      reports,
                      measureTaxonomies,
                      isContributor,
                      onEntityClick,
                      measureConnections,
                      recommendationsByFw,
                      recommendationTaxonomies,
                      recommendationConnections,
                      frameworks,
                    ),
                    aside: isContributor ? this.getBodyAsideFields(viewEntity, dates) : null,
                  },
                }}
              />
            )
          }
        </Content>
      </div>
    );
  }
}

IndicatorView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onEntityClick: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  handleNewReport: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isContributor: PropTypes.bool,
  isManager: PropTypes.bool,
  measures: PropTypes.object,
  reports: PropTypes.object,
  measureTaxonomies: PropTypes.object,
  dates: PropTypes.object,
  params: PropTypes.object,
  measureConnections: PropTypes.object,
  queryMessages: PropTypes.object,
  onDismissQueryMessages: PropTypes.func,
  recommendationTaxonomies: PropTypes.object,
  recommendationConnections: PropTypes.object,
  recommendationsByFw: PropTypes.object,
  frameworks: PropTypes.object,
};

IndicatorView.contextTypes = {
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isContributor: selectIsUserContributor(state),
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  measureTaxonomies: selectMeasureTaxonomies(state),
  recommendationsByFw: selectRecommendations(state, props.params.id),
  recommendationTaxonomies: selectRecommendationTaxonomies(state),
  reports: selectReports(state, props.params.id),
  dates: selectDueDates(state, props.params.id),
  measureConnections: selectMeasureConnections(state),
  recommendationConnections: selectRecommendationConnections(state),
  queryMessages: selectQueryMessages(state),
  frameworks: selectActiveFrameworks(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: () => {
      dispatch(updatePath(`${PATHS.INDICATORS}${PATHS.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleNewReport: () => {
      dispatch(updatePath(`${PATHS.PROGRESS_REPORTS}${PATHS.NEW}/${props.params.id}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(PATHS.INDICATORS));
      // TODO should be "go back" if history present or to indicators list when not
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorView);

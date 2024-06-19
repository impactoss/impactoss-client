/*
 *
 * IndicatorView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';

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
  canUserCreateOrEditReports,
  canUserBeAssignedToReports,
} from 'utils/permissions';
import {
  loadEntitiesIfNeeded, updatePath, closeEntity, dismissQueryMessages,
} from 'containers/App/actions';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectSessionUserId,
  selectSessionUserHighestRoleId,
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

  getHeaderAsideFields = (entity) => ([{
    fields: [
      getStatusField(entity),
      getMetaField(entity),
    ],
  }]);

  getBodyMainFields = ({
    entity,
    measures,
    reports,
    measureTaxonomies,
    onEntityClick,
    measureConnections,
    recommendationsByFw,
    recommendationTaxonomies,
    recommendationConnections,
    frameworks,
    canCreateReports,
  }) => {
    const { intl } = this.props;
    const fields = [];
    // own attributes
    fields.push({
      fields: [
        getMarkdownField(entity, 'description', true),
        getReportsField(
          reports,
          canCreateReports
            ? {
              type: 'add',
              title: intl.formatMessage(messages.addReport),
              onClick: this.props.handleNewReport,
            }
            : null
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
      userId,
      highestRole,
      intl,
    } = this.props;
    let buttons = [];

    const hasUserMinimumRole = dataReady && canUserCreateOrEditReports(highestRole);
    const isUserAssigned = dataReady && viewEntity && canUserBeAssignedToReports(highestRole)
      && qe(viewEntity.getIn(['attributes', 'manager_id']), userId);
    const canCreateReports = hasUserMinimumRole || isUserAssigned;

    if (dataReady) {
      buttons = [
        ...buttons,
        {
          type: 'icon',
          onClick: () => window.print(),
          title: intl.formatMessage(appMessages.buttons.printTitle),
          icon: 'print',
        },
      ];

      if (canCreateReports) {
        buttons = [
          ...buttons,
          {
            type: 'text',
            title: intl.formatMessage(messages.addReport),
            onClick: this.props.handleNewReport,
          },
        ];
      }
      if (isManager) {
        buttons = [
          ...buttons,
          {
            type: 'edit',
            onClick: () => this.props.handleEdit(this.props.params.id),
          },
        ];
      }
      buttons = [
        ...buttons,
        {
          type: 'close',
          onClick: this.props.handleClose,
        },
      ];
    }

    const pageTitle = intl.formatMessage(messages.pageTitle);
    const metaTitle = viewEntity
      ? `${pageTitle} ${getEntityReference(viewEntity)}: ${getEntityTitleTruncated(viewEntity)}`
      : `${pageTitle} ${this.props.params.id}`;

    return (
      <div>
        <HelmetCanonical
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
                    aside: isManager && this.getHeaderAsideFields(viewEntity),
                  },
                  body: {
                    main: this.getBodyMainFields({
                      entity: viewEntity,
                      measures,
                      reports,
                      measureTaxonomies,
                      onEntityClick,
                      measureConnections,
                      recommendationsByFw,
                      recommendationTaxonomies,
                      recommendationConnections,
                      frameworks,
                      canCreateReports,
                    }),
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
  highestRole: PropTypes.number,
  userId: PropTypes.string,
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
  userId: selectSessionUserId(state),
  highestRole: selectSessionUserHighestRoleId(state),
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
      dispatch(updatePath(`${ROUTES.INDICATORS}${ROUTES.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleNewReport: () => {
      dispatch(updatePath(`${ROUTES.PROGRESS_REPORTS}${ROUTES.NEW}/${props.params.id}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(ROUTES.INDICATORS));
      // TODO should be "go back" if history present or to indicators list when not
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(IndicatorView));

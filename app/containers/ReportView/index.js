/*
 *
 * ReportView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getDateRelatedField,
  getDownloadField,
  getEntityLinkField,
} from 'utils/fields';

import { getEntityTitleTruncated } from 'utils/entities';
import {
  canUserCreateOrEditReports,
  canUserBeAssignedToReports,
} from 'utils/permissions';

import qe from 'utils/quasi-equals';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserContributor,
  selectIsUserManager,
  selectSessionUserId,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';
import { selectViewEntity } from './selectors';
import { DEPENDENCIES } from './constants';

export class ReportView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isManager, indicator) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getTitleField(entity, isManager),
        getEntityLinkField(indicator, '/indicators', appMessages.entities.indicators.single),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(entity),
        getMetaField(entity),
      ],
    },
  ]);

  getBodyMainFields = (entity, isContributor) => ([
    {
      fields: [
        getMarkdownField(entity, 'description', true),
        getDownloadField(entity, entity.getIn(['attributes', 'document_public']) || isContributor),
      ],
    },
  ]);

  getBodyAsideFields = (entity) => ([ // fieldGroups
    {
      type: 'dark',
      fields: [
        getDateRelatedField(entity.getIn(['date', 'attributes', 'due_date']), 'due_date_id', true, appMessages.entities.progress_reports.unscheduled),
      ],
    },
  ]);


  render() {
    const { intl } = this.context;
    const {
      viewEntity, dataReady, isContributor, sessionUserId, highestRole,
    } = this.props;
    const hasUserMinimumRole = dataReady
      && canUserCreateOrEditReports(highestRole);
    const isUserAssigned = dataReady
      && canUserBeAssignedToReports(highestRole)
      && viewEntity.get('indicator')
      && qe(viewEntity.get('indicator').getIn(['attributes', 'manager_id']), sessionUserId);
    const canEdit = hasUserMinimumRole || (isUserAssigned && viewEntity.getIn(['attributes', 'draft']));

    let buttons = [];
    if (dataReady) {
      buttons.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
      buttons = canEdit
        ? buttons.concat([
          {
            type: 'edit',
            onClick: this.props.handleEdit,
          },
          {
            type: 'close',
            onClick: () => this.props.handleClose(viewEntity.getIn(['indicator', 'id'])),
          },
        ])
        : buttons.concat([
          {
            type: 'close',
            onClick: () => this.props.handleClose(viewEntity.getIn(['indicator', 'id'])),
          },
        ]);
    }
    const pageTitle = intl.formatMessage(messages.pageTitle);
    const metaTitle = viewEntity
      ? `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`
      : `${pageTitle}: ${this.props.params.id}`;

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
            icon="report"
            buttons={buttons}
          />
          { !dataReady
            && <Loading />
          }
          { !viewEntity && dataReady
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          { viewEntity && dataReady
            && (
              <EntityView
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity, isContributor, viewEntity.get('indicator')),
                    aside: isContributor && this.getHeaderAsideFields(viewEntity),
                  },
                  body: {
                    main: this.getBodyMainFields(viewEntity, isContributor),
                    aside: isContributor ? this.getBodyAsideFields(viewEntity) : null,
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

ReportView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleClose: PropTypes.func,
  handleEdit: PropTypes.func,
  viewEntity: PropTypes.object,
  sessionUserId: PropTypes.string,
  dataReady: PropTypes.bool,
  isContributor: PropTypes.bool,
  isManager: PropTypes.bool,
  params: PropTypes.object,
  highestRole: PropTypes.number,
};

ReportView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  sessionUserId: selectSessionUserId(state),
  isContributor: selectIsUserContributor(state),
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  highestRole: selectSessionUserHighestRoleId(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: () => {
      dispatch(updatePath(`${ROUTES.PROGRESS_REPORTS}${ROUTES.EDIT}/${props.params.id}`, { replace: true }));
    },
    handleClose: (indicatorId) => {
      dispatch(closeEntity(`${ROUTES.INDICATORS}/${indicatorId}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportView);

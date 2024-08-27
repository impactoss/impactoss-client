/*
 *
 * ReportEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { Map, fromJS } from 'immutable';

import {
  getTitleFormField,
  getDueDateOptionsField,
  getStatusField,
  getArchiveField,
  getMarkdownFormField,
  getUploadField,
  getDocumentStatusField,
  getDueDateDateOptions,
} from 'utils/forms';

import {
  getMetaField,
  getStatusField as getStatusInfoField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import {
  canUserCreateOrEditReports,
  canUserBeAssignedToReports,
  canUserDeleteEntities,
  canUserPublishReports,
} from 'utils/permissions';

import qe from 'utils/quasi-equals';
import { lowerCase } from 'utils/string';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { CONTRIBUTOR_MIN_ROLE_ASSIGNED, IS_ARCHIVE_STATUSES } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectNotPermitted,
  redirectIfNotPermitted,
  updatePath,
  deleteEntity,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectSessionUserHighestRoleId,
  selectSessionUserId,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';
import NotFoundEntity from 'containers/NotFoundEntity';

import {
  selectDomain,
  selectViewEntity,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class ReportEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
    this.remoteSubmitForm = null;
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady) {
      this.props.onRedirectIfNotPermitted();
    }
    if (nextProps.dataReady && nextProps.authReady && nextProps.viewEntity) {
      // to allow creating it requires
      // user to have CONTRIBUTOR_MIN_ROLE
      // OR
      //    user to have CONTRIBUTOR_MIN_ROLE_ASSIGNED
      //    AND
      //    user to be assigned
      //
      // otherwise redirect to unauthorised
      const hasUserMinimumRole = canUserCreateOrEditReports(nextProps.highestRole);
      const isUserAssigned = canUserBeAssignedToReports(nextProps.highestRole)
        && qe(nextProps.viewEntity.get('indicator').getIn(['attributes', 'manager_id']), nextProps.userId);
      const canEdit = hasUserMinimumRole || (isUserAssigned && nextProps.viewEntity.getIn(['attributes', 'draft']));
      if (!canEdit) {
        this.props.onRedirectNotPermitted();
      }
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getInitialFormData = ({ viewEntity }) => {
    let attributes = viewEntity.get('attributes');
    attributes = attributes.set('due_date_id', attributes.get('due_date_id')
      ? attributes.get('due_date_id').toString()
      : '0');
    return viewEntity
      ? Map({
        id: viewEntity.get('id'),
        attributes: attributes.mergeWith(
          (oldVal, newVal) => oldVal === null ? newVal : oldVal,
          FORM_INITIAL.get('attributes')
        ),
      })
      : Map();
  };

  getHeaderMainFields = (intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getTitleFormField(intl.formatMessage),
        ],
      },
    ]);

  getHeaderAsideFields = (entity, canUserPublish, intl) =>
    ([
      {
        fields: [
          canUserPublish
            ? getStatusField(intl.formatMessage)
            : getStatusInfoField(entity),
          canUserPublish
            ? getArchiveField(intl.formatMessage)
            : getStatusInfoField(
              entity,
              'is_archive',
              IS_ARCHIVE_STATUSES,
              appMessages.attributes.is_archive,
              false
            ),
          getMetaField(entity),
        ],
      },
    ]);

  getBodyMainFields = (intl) =>
    ([
      {
        fields: [
          getMarkdownFormField({ formatMessage: intl.formatMessage }),
          getUploadField(intl.formatMessage),
          getDocumentStatusField(intl.formatMessage),
        ],
      },
    ]);

  getBodyAsideFields = (entity, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.due_dates.single),
        icon: 'calendar',
        fields: entity.get('indicator') && entity.getIn(['indicator', 'dates'])
          && [getDueDateOptionsField(
            intl.formatMessage,
            getDueDateDateOptions(
              entity.getIn(['indicator', 'dates']),
              intl.formatMessage,
              intl.formatDate,
              entity.getIn(['attributes', 'due_date_id'])
                ? entity.getIn(['attributes', 'due_date_id']).toString()
                : '0',
            ),
          )],
      },
    ]);

  render() {
    const {
      viewEntity, dataReady, viewDomain, intl,
    } = this.props;
    const reference = this.props.params.id;
    const {
      saveSending, saveError, deleteSending, deleteError, submitValid,
    } = viewDomain.get('page').toJS();

    let pageTitle = intl.formatMessage(messages.pageTitle);
    if (viewEntity && dataReady) {
      pageTitle = intl.formatMessage(messages.pageTitleReference, {
        indicatorReference: viewEntity.getIn(['attributes', 'indicator_id']),
      });
    }
    return (
      <div>
        <HelmetCanonical
          title={pageTitle}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="reports"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: (e) => {
                  if (this.remoteSubmitForm) {
                    this.remoteSubmitForm(e);
                  }
                },
              }] : null
            }
          />
          {!submitValid
            && (
              <Messages
                type="error"
                messageKey="submitInvalid"
                onDismiss={this.props.onErrorDismiss}
              />
            )
          }
          {saveError
            && (
              <Messages
                type="error"
                messages={saveError.messages}
                onDismiss={this.props.onServerErrorDismiss}
              />
            )
          }
          {deleteError
            && <Messages type="error" messages={deleteError.messages} />
          }
          {(saveSending || deleteSending || !dataReady)
            && <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending && (
            <NotFoundEntity
              id={this.props.params.id}
              type={lowerCase(intl.formatMessage(appMessages.entities.progress_reports.single))}
            />
          )}
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  viewEntity
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={() => this.props.handleCancel(reference)}
                handleDelete={canUserDeleteEntities(this.props.highestRole)
                  ? () => this.props.handleDelete(viewEntity.getIn(['attributes', 'indicator_id']))
                  : null
                }
                fields={{
                  header: {
                    main: this.getHeaderMainFields(intl),
                    aside: this.getHeaderAsideFields(
                      viewEntity,
                      canUserPublishReports(this.props.highestRole),
                      intl,
                    ),
                  },
                  body: {
                    main: this.getBodyMainFields(intl),
                    aside: this.getBodyAsideFields(viewEntity, intl),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { (saveSending || deleteSending)
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ReportEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onRedirectIfNotPermitted: PropTypes.func,
  onRedirectNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  highestRole: PropTypes.number,
  params: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  // userId: PropTypes.string, // used in nextProps
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  highestRole: selectSessionUserHighestRoleId(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  userId: selectSessionUserId(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
      dispatch(loadEntitiesIfNeeded('indicators'));
    },
    onRedirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(CONTRIBUTOR_MIN_ROLE_ASSIGNED));
    },
    onRedirectNotPermitted: () => {
      dispatch(redirectNotPermitted());
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmit: (formValues, viewEntity) => {
      const formData = fromJS(formValues)
      let saveData = formData;
      const previousDateAssigned = viewEntity.getIn(['attributes', 'due_date_id']);
      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      saveData = saveData.setIn(
        ['attributes', 'due_date_id'],
        dateAssigned === '0' || dateAssigned === 0
          ? null
          : parseInt(dateAssigned, 10)
      );
      // check if attributes have changed
      if (saveData.get('attributes').equals(viewEntity.get('attributes'))) {
        saveData = saveData.set('skipAttributes', true);
      }
      dispatch(save(
        saveData.toJS(),
        previousDateAssigned && previousDateAssigned !== dateAssigned
          ? previousDateAssigned
          : null
      ));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`${ROUTES.PROGRESS_REPORTS}/${reference}`, { replace: true }));
    },
    handleDelete: (indicatorId) => {
      dispatch(deleteEntity({
        path: 'progress_reports',
        id: props.params.id,
        redirect: `${ROUTES.INDICATORS}/${indicatorId}`,
      }));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReportEdit));

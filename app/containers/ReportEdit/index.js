/*
 *
 * ReportEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map } from 'immutable';

import {
  getTitleFormField,
  getDueDateOptionsField,
  getDocumentStatusField,
  getStatusField,
  getMarkdownField,
  getUploadField,
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


import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { CONTRIBUTOR_MIN_ROLE_ASSIGNED } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectNotPermitted,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  deleteEntity,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectSessionUserHighestRoleId,
  selectSessionUserId,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';
import Footer from 'containers/Footer';

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
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('reportEdit.form.data', this.getInitialFormData());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }

    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('reportEdit.form.data', this.getInitialFormData(nextProps));
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

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity } = props;
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
  }

  getHeaderMainFields = () => {
    const { intl } = this.context;
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          getTitleFormField(intl.formatMessage),
        ],
      },
    ]);
  };

  getHeaderAsideFields = (entity, canUserPublish) => {
    const { intl } = this.context;
    return ([
      {
        fields: [
          canUserPublish
            ? getStatusField(intl.formatMessage)
            : getStatusInfoField(entity),
          getMetaField(entity),
        ],
      },
    ]);
  };

  getBodyMainFields = () => {
    const { intl } = this.context;
    return ([
      {
        fields: [
          getMarkdownField(intl.formatMessage),
          getUploadField(intl.formatMessage),
          getDocumentStatusField(intl.formatMessage),
        ],
      },
    ]);
  };

  getBodyAsideFields = (entity) => {
    const { intl } = this.context;
    return ([ // fieldGroups
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
  };

  render() {
    const { intl } = this.context;
    const { viewEntity, dataReady, viewDomain } = this.props;
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
        <Helmet
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
                onClick: () => this.props.handleSubmitRemote('reportEdit.form.data'),
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
            && <Messages type="error" messages={deleteError} />
          }
          {(saveSending || deleteSending || !dataReady)
            && <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                model="reportEdit.form.data"
                formData={viewDomain.getIn(['form', 'data'])}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData, viewEntity.getIn(['attributes', 'due_date_id']))}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={() => this.props.handleCancel(reference)}
                handleUpdate={this.props.handleUpdate}
                handleDelete={canUserDeleteEntities(this.props.highestRole)
                  ? () => this.props.handleDelete(viewEntity.getIn(['attributes', 'indicator_id']))
                  : null
                }
                fields={{
                  header: {
                    main: this.getHeaderMainFields(),
                    aside: this.getHeaderAsideFields(
                      viewEntity,
                      canUserPublishReports(this.props.highestRole),
                    ),
                  },
                  body: {
                    main: this.getBodyMainFields(),
                    aside: this.getBodyAsideFields(viewEntity),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { (saveSending || deleteSending)
            && <Loading />
          }
          <Footer />
        </Content>
      </div>
    );
  }
}

ReportEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onRedirectIfNotPermitted: PropTypes.func,
  onRedirectNotPermitted: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  highestRole: PropTypes.number,
  params: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  // userId: PropTypes.string, // used in nextProps
};

ReportEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  highestRole: selectSessionUserHighestRoleId(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
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
    initialiseForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
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
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData, previousDateAssigned) => {
      let saveData = formData;

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      saveData = saveData.setIn(
        ['attributes', 'due_date_id'],
        dateAssigned === '0' || dateAssigned === 0
          ? null
          : parseInt(dateAssigned, 10)
      );

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
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportEdit);

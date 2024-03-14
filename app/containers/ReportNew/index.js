/*
 *
 * ReportNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map } from 'immutable';

import {
  getTitleFormField,
  getDueDateOptionsField,
  getStatusField,
  getMarkdownField,
  getUploadField,
  getDocumentStatusField,
  getDueDateDateOptions,
} from 'utils/forms';

import { getStatusField as getStatusInfoField } from 'utils/fields';

import qe from 'utils/quasi-equals';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import {
  canUserPublishReports,
  canUserCreateOrEditReports,
  canUserBeAssignedToReports,
  canUserSeeDraftContent,
} from 'utils/permissions';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
  submitInvalid,
  saveErrorDismiss,
  redirectNotPermitted,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectSessionUserId,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';
import Footer from 'containers/Footer';

import {
  selectDomain,
  selectIndicator,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class ReportNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      draftNoteDismissed: false,
    };
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.indicator) {
      this.props.initialiseForm('reportNew.form.data', this.getInitialFormData());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.indicator) {
      this.props.initialiseForm('reportNew.form.data', this.getInitialFormData(nextProps));
    }
    // console.log('UNSAFE_componentWillReceiveProps', nextProps.indicator, this.props.indicator)
    if (nextProps.dataAndAuthReady && nextProps.indicator) {
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
        && qe(nextProps.indicator.getIn(['attributes', 'manager_id']), nextProps.userId);
      const canCreate = hasUserMinimumRole || isUserAssigned;
      if (!canCreate) {
        this.props.onRedirectNotPermitted();
      }
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
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

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { indicator } = props;
    return Map(FORM_INITIAL.setIn(
      ['attributes', 'due_date_id'],
      indicator.get('dates')
        ? getDueDateDateOptions(indicator.get('dates'))[0].value
        : '0'
    ));
  }

  getHeaderAsideFields = (canUserPublish) => {
    const { intl } = this.context;
    return ([{
      fields: [
        canUserPublish
          ? getStatusField(intl.formatMessage)
          : getStatusInfoField(),
      ],
    }]);
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

  getBodyAsideFields = (indicator) => {
    const { intl } = this.context;
    return ([ // fieldGroups
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.due_dates.single),
        icon: 'calendar',
        fields: indicator
          && [getDueDateOptionsField(
            intl.formatMessage,
            getDueDateDateOptions(
              indicator.get('dates'),
              intl.formatMessage,
              intl.formatDate
            )
          )],
      },
    ]);
  };

  dismissDraftNote = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ draftNoteDismissed: true });
  }

  render() {
    const { intl } = this.context;
    const {
      dataReady, indicator, viewDomain, highestRole,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();
    const indicatorReference = this.props.params.id;
    const canUserPublish = dataReady && canUserPublishReports(highestRole);

    const pageTitle = intl.formatMessage(messages.pageTitle, { indicatorReference });

    return (
      <div>
        <HelmetCanonical
          title={pageTitle}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="reports"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(indicatorReference),
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => {
                  this.dismissDraftNote();
                  this.props.handleSubmitRemote('reportNew.form.data');
                },
              }] : null
            }
          />
          { !canUserPublish && !this.state.draftNoteDismissed && dataReady && !saveError && !!submitValid
            && (
              <Messages
                type="info"
                message={intl.formatMessage(messages.draftNote)}
                onDismiss={this.dismissDraftNote}
              />
            )
          }
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
          {(saveSending || !dataReady)
            && <Loading />
          }
          {dataReady
            && (
              <EntityForm
                model="reportNew.form.data"
                formData={viewDomain.getIn(['form', 'data'])}
                saving={saveSending}
                handleSubmit={(formData) => {
                  this.dismissDraftNote();
                  this.props.handleSubmit(
                    formData,
                    indicatorReference,
                    highestRole
                  );
                }}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={() => this.props.handleCancel(indicatorReference)}
                handleUpdate={this.props.handleUpdate}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(),
                    aside: this.getHeaderAsideFields(canUserPublish),
                  },
                  body: {
                    main: this.getBodyMainFields(),
                    aside: this.getBodyAsideFields(indicator),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { saveSending
            && <Loading />
          }
          <Footer />
        </Content>
      </div>
    );
  }
}

ReportNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  onRedirectNotPermitted: PropTypes.func,
  indicator: PropTypes.object,
  params: PropTypes.object,
  initialiseForm: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  highestRole: PropTypes.number,
  // userId: PropTypes.string, // used in nextProps
  // dataAndAuthReady: PropTypes.bool, // used in nextProps
};

ReportNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  dataAndAuthReady:
    selectReady(state, { path: DEPENDENCIES })
    && selectReadyForAuthCheck(state),
  indicator: selectIndicator(state, props.params.id),
  userId: selectSessionUserId(state),
  highestRole: selectSessionUserHighestRoleId(state),
});

function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    onRedirectNotPermitted: () => {
      dispatch(redirectNotPermitted());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData, indicatorReference, highestRole) => {
      let saveData = formData;

      saveData = saveData.setIn(['attributes', 'indicator_id'], indicatorReference);

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      if (dateAssigned === 0 || dateAssigned === '0') {
        saveData = saveData.setIn(['attributes', 'due_date_id'], null);
      }

      dispatch(save(
        saveData.toJS(),
        canUserSeeDraftContent(highestRole) ? ROUTES.PROGRESS_REPORTS : `${ROUTES.INDICATORS}/${indicatorReference}`,
        !canUserSeeDraftContent(highestRole) // createAsGuest: do not append created id to redirect, do not create locally
      ));
    },
    handleCancel: (indicatorReference) => {
      dispatch(updatePath(`${ROUTES.INDICATORS}/${indicatorReference}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportNew);

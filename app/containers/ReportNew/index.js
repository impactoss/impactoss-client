/*
 *
 * ReportNew
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
  getMarkdownFormField,
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
import EntityForm from 'containers/EntityForm';

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

  getHeaderMainFields = (intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getTitleFormField(intl.formatMessage),
        ],
      },
    ]);

  getInitialFormData = ({ indicator }) =>
    Map(FORM_INITIAL.setIn(
      ['attributes', 'due_date_id'],
      indicator && indicator.get('dates')
        ? getDueDateDateOptions(indicator.get('dates'))[0].value
        : '0',
    ));

  getHeaderAsideFields = (canUserPublish, intl) =>
    ([
      {
        fields: [
          canUserPublish
            ? getStatusField(intl.formatMessage)
            : getStatusInfoField(),
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

  getBodyAsideFields = (indicator, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.due_dates.single),
        icon: 'calendar',
        fields: indicator
          && [getDueDateOptionsField(
            intl.formatMessage,
            getDueDateDateOptions(
              indicator.get('dates'),
              intl.formatMessage,
              intl.formatDate,
            ),
          )],
      },
    ]);

  dismissDraftNote = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ draftNoteDismissed: true });
  };

  render() {
    const {
      dataReady, indicator, viewDomain, highestRole, intl,
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
          { !canUserPublish && !this.state.draftNoteDismissed && dataReady && !saveError && !!submitValid
            && (
              <Messages
                type="info"
                message={intl.formatMessage(messages.draftNote)}
                onDismiss={this.dismissDraftNote}
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
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                handleSubmit={(formData) => {
                  this.dismissDraftNote();
                  this.props.handleSubmit(
                    formData,
                    indicatorReference,
                    highestRole,
                  );
                }}
                handleCancel={() => this.props.handleCancel(indicatorReference)}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(intl),
                    aside: this.getHeaderAsideFields(canUserPublish, intl),
                  },
                  body: {
                    main: this.getBodyMainFields(intl),
                    aside: this.getBodyAsideFields(indicator, intl),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
                headerTitle={pageTitle}
                headerType={CONTENT_SINGLE}
                headerIcon="reports"
              />
            )
          }
          { saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ReportNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  onRedirectNotPermitted: PropTypes.func,
  indicator: PropTypes.object,
  params: PropTypes.object,
  onServerErrorDismiss: PropTypes.func.isRequired,
  highestRole: PropTypes.number,
  userId: PropTypes.string, // used in nextProps
  dataAndAuthReady: PropTypes.bool, // used in nextProps
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
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    onRedirectNotPermitted: () => {
      dispatch(redirectNotPermitted());
    },
    handleSubmit: (formValues, indicatorReference, highestRole) => {
      const formData = fromJS(formValues);
      let saveData = formData;

      saveData = saveData.setIn(['attributes', 'indicator_id'], indicatorReference);

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      if (dateAssigned === 0 || dateAssigned === '0') {
        saveData = saveData.setIn(['attributes', 'due_date_id'], null);
      }

      dispatch(save(
        saveData.toJS(),
        canUserSeeDraftContent(highestRole) ? ROUTES.PROGRESS_REPORTS : `${ROUTES.INDICATORS}/${indicatorReference}`,
        !canUserSeeDraftContent(highestRole), // createAsGuest: do not append created id to redirect, do not create locally
      ));
    },
    handleCancel: (indicatorReference) => {
      dispatch(updatePath(`${ROUTES.INDICATORS}/${indicatorReference}`, { replace: true }));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReportNew));

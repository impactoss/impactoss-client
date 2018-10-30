/*
 *
 * ReportNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
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

import { getStatusField as getStatusInfoField } from 'utils/fields';

import { attributesEqual } from 'utils/entities';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectIsUserContributor,
  selectIsUserManager,
  selectSessionUserId,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
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
      scrollContainer: null,
      guestDismissed: false,
    };
  }

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.indicator) {
      this.props.initialiseForm('reportNew.form.data', this.getInitialFormData());
    }
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.indicator) {
      this.props.initialiseForm('reportNew.form.data', this.getInitialFormData(nextProps));
    }
    if (hasNewError(nextProps, this.props) && this.state.scrollContainer) {
      scrollToTop(this.state.scrollContainer);
    }
  }
  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getTitleFormField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);

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

  getHeaderAsideFields = (canUserPublish) => ([{
    fields: [
      canUserPublish
      ? getStatusField(this.context.intl.formatMessage, appMessages)
      : getStatusInfoField(),
    ],
  }]);

  getBodyMainFields = () => ([
    {
      fields: [
        getMarkdownField(this.context.intl.formatMessage, appMessages),
        getUploadField(this.context.intl.formatMessage, appMessages),
        getDocumentStatusField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);

  getBodyAsideFields = (indicator) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.single),
      icon: 'calendar',
      fields: indicator &&
        [getDueDateOptionsField(
          this.context.intl.formatMessage,
          appMessages,
          getDueDateDateOptions(
            indicator.get('dates'),
            this.context.intl.formatMessage,
            appMessages,
            this.context.intl.formatDate
          )
        )],
    },
  ]);

  dismissGuestMessage = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ guestDismissed: true });
  }

  canUserPublish = (isUserContributor, isUserManager, userId, indicator) =>
    isUserManager || (isUserContributor && attributesEqual(userId, indicator.getIn(['attributes', 'manager_id'])));

  render() {
    const { dataReady, indicator, viewDomain, isUserContributor, isUserManager, userId } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;
    const indicatorReference = this.props.params.id;
    const canUserPublish = dataReady && this.canUserPublish(
      isUserContributor,
      isUserManager,
      userId,
      indicator
    );

    const pageTitle = this.context.intl.formatMessage(messages.pageTitle, { indicatorReference });

    return (
      <div>
        <Helmet
          title={pageTitle}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content
          innerRef={(node) => {
            if (!this.state.scrollContainer) {
              this.setState({ scrollContainer: node });
            }
          }}
        >
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
                  this.dismissGuestMessage();
                  this.props.handleSubmitRemote('reportNew.form.data');
                },
              }] : null
            }
          />
          { !canUserPublish && !this.state.guestDismissed && dataReady && !saveError && !!submitValid &&
            <Messages
              type="info"
              message={this.context.intl.formatMessage(messages.guestNote)}
              onDismiss={this.dismissGuestMessage}
            />
          }
          {!submitValid &&
            <Messages
              type="error"
              messageKey="submitInvalid"
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <Messages
              type="error"
              messages={saveError.messages}
              onDismiss={this.props.onServerErrorDismiss}
            />
          }
          {(saveSending || !dataReady) &&
            <Loading />
          }
          {dataReady &&
            <EntityForm
              model="reportNew.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => {
                this.dismissGuestMessage();
                this.props.handleSubmit(
                  formData,
                  indicatorReference,
                  canUserPublish
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
                  aside: canUserPublish && this.getBodyAsideFields(indicator),
                },
              }}
              scrollContainer={this.state.scrollContainer}
            />
          }
          { saveSending &&
            <Loading />
          }
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
  indicator: PropTypes.object,
  params: PropTypes.object,
  initialiseForm: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  isUserContributor: PropTypes.bool,
  isUserManager: PropTypes.bool,
  userId: PropTypes.string,
};

ReportNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  indicator: selectIndicator(state, props.params.id),
  isUserContributor: selectIsUserContributor(state),
  isUserManager: selectIsUserManager(state),
  userId: selectSessionUserId(state),
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
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData, indicatorReference, canUserPublish) => {
      let saveData = formData;

      saveData = saveData.setIn(['attributes', 'indicator_id'], indicatorReference);

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      if (dateAssigned === 0 || dateAssigned === '0') {
        saveData = saveData.setIn(['attributes', 'due_date_id'], null);
      }

      dispatch(save(
        saveData.toJS(),
        canUserPublish ? PATHS.PROGRESS_REPORTS : `${PATHS.INDICATORS}/${indicatorReference}`,
        !canUserPublish // createAsGuest: do not append created id to redirect, do not create locally
      ));
    },
    handleCancel: (indicatorReference) => {
      dispatch(updatePath(`${PATHS.INDICATORS}/${indicatorReference}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportNew);

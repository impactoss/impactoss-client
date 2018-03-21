/*
 *
 * IndicatorNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  renderMeasureControl,
  renderSdgTargetControl,
  renderUserControl,
  getTitleFormField,
  getReferenceFormField,
  getStatusField,
  getMarkdownField,
  getDateField,
  getFrequencyField,
  getCheckboxField,
} from 'utils/forms';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';
import validateDateAfterDate from 'components/forms/validators/validate-date-after-date';
import validatePresenceConditional from 'components/forms/validators/validate-presence-conditional';
import validateRequired from 'components/forms/validators/validate-required';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectMeasuresCategorised,
  selectSdgTargetsCategorised,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import {
  selectDomain,
  selectUsers,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class IndicatorNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('indicatorNew.form.data', FORM_INITIAL);
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.ScrollContainer) {
      scrollToTop(this.ScrollContainer);
    }
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage, appMessages, false, true),
        getTitleFormField(this.context.intl.formatMessage, appMessages, 'titleText'),
      ],
    },
  ]);

  getHeaderAsideFields = () => ([
    {
      fields: [
        getStatusField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);

  getBodyMainFields = (connectedTaxonomies, measures, sdgtargets, onCreateOption) => ([
    {
      fields: [getMarkdownField(this.context.intl.formatMessage, appMessages)],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderMeasureControl(measures, connectedTaxonomies, onCreateOption, this.context.intl),
        renderSdgTargetControl(sdgtargets, connectedTaxonomies, onCreateOption, this.context.intl),
      ],
    },
  ]);

  getBodyAsideFields = (users, repeat) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.schedule),
      icon: 'reminder',
      fields: [
        getDateField(
          this.context.intl.formatMessage,
          appMessages,
          'start_date',
          repeat,
          repeat ? 'start_date' : 'start_date_only',
          (model, value) => this.props.onStartDateChange(model, value, this.props.viewDomain.form.data, this.context.intl.formatMessage)
        ),
        getCheckboxField(
          this.context.intl.formatMessage,
          appMessages,
          'repeat',
          null,
          (model, value) => this.props.onRepeatChange(model, value, this.props.viewDomain.form.data, this.context.intl.formatMessage)
        ),
        repeat ? getFrequencyField(this.context.intl.formatMessage, appMessages) : null,
        repeat ? getDateField(
          this.context.intl.formatMessage,
          appMessages,
          'end_date',
          repeat,
          'end_date',
          (model, value) => this.props.onEndDateChange(model, value, this.props.viewDomain.form.data, this.context.intl.formatMessage)
        )
        : null,
        renderUserControl(
          users,
          this.context.intl.formatMessage(appMessages.attributes.manager_id.indicators),
        ),
      ],
    },
  ]);

  render() {
    const { dataReady, viewDomain, connectedTaxonomies, measures, users, sdgtargets, onCreateOption } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;
    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content innerRef={(node) => { this.ScrollContainer = node; }} >
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="indicators"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('indicatorNew.form.data'),
              }] : null
            }
          />
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
              model="indicatorNew.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={this.props.handleSubmit}
              handleSubmitFail={(formData) => this.props.handleSubmitFail(formData, this.context.intl.formatMessage)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              validators={{
                '': {
                  // Form-level validator
                  endDatePresent: (vals) => validatePresenceConditional(vals.getIn(['attributes', 'repeat']), vals.getIn(['attributes', 'end_date'])),
                  startDatePresent: (vals) => validatePresenceConditional(vals.getIn(['attributes', 'repeat']), vals.getIn(['attributes', 'start_date'])),
                  endDateAfterStartDate: (vals) => vals.getIn(['attributes', 'repeat']) ? validateDateAfterDate(vals.getIn(['attributes', 'end_date']), vals.getIn(['attributes', 'start_date'])) : true,
                },
              }}
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(),
                },
                body: {
                  main: this.getBodyMainFields(connectedTaxonomies, measures, sdgtargets, onCreateOption),
                  aside: this.getBodyAsideFields(users, viewDomain.form.data.getIn(['attributes', 'repeat'])),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

IndicatorNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  users: PropTypes.object,
  onCreateOption: PropTypes.func,
  initialiseForm: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onRepeatChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
};

IndicatorNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  // all measures,
  measures: selectMeasuresCategorised(state),
  // all sdgtargets,
  sdgtargets: selectSdgTargetsCategorised(state),
  // all users, listing connection if any
  users: selectUsers(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
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
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    onRepeatChange: (repeatModel, repeat, formData, formatMessage) => {
      // reset repeat erros when repeat turned off
      if (!repeat) {
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.start_date', {
          required: false,
          startDateAfterEndDateError: false,
        }));
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.end_date', {
          required: false,
          endDateBeforeStartDateError: false,
        }));
      } else if (validateRequired(formData.getIn(['attributes', 'start_date']))
        && validateRequired(formData.getIn(['attributes', 'end_date']))
        && !validateDateAfterDate(formData.getIn(['attributes', 'end_date']), formData.getIn(['attributes', 'start_date']))
      ) {
        dispatch(formActions.setErrors(
          'indicatorNew.form.data.attributes.start_date',
          { startDateAfterEndDateError: formatMessage(appMessages.forms.startDateAfterEndDateError) }
        ));
        dispatch(formActions.setErrors(
          'indicatorNew.form.data.attributes.end_date',
          { endDateBeforeStartDateError: formatMessage(appMessages.forms.endDateBeforeStartDateError) }
        ));
      }
      dispatch(formActions.change(repeatModel, repeat));
    },
    onStartDateChange: (dateModel, dateValue, formData, formatMessage) => {
      // validateDateAfterDate if repeat and both dates present
      if (formData.getIn(['attributes', 'repeat'])
        && validateRequired(formData.getIn(['attributes', 'end_date']))
        && validateRequired(dateValue)
        && !validateDateAfterDate(formData.getIn(['attributes', 'end_date']), dateValue)
      ) {
        dispatch(formActions.setErrors(
          'indicatorNew.form.data.attributes.start_date',
          { startDateAfterEndDateError: formatMessage(appMessages.forms.startDateAfterEndDateError) }
        ));
      } else {
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.start_date', { startDateAfterEndDateError: false }));
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.end_date', { endDateBeforeStartDateError: false }));
      }
      dispatch(formActions.change(dateModel, dateValue));
    },
    onEndDateChange: (dateModel, dateValue, formData, formatMessage) => {
      if (formData.getIn(['attributes', 'repeat'])
        && validateRequired(dateValue)
        && validateRequired(formData.getIn(['attributes', 'start_date']))
        && !validateDateAfterDate(dateValue, formData.getIn(['attributes', 'start_date']))
      ) {
        dispatch(formActions.setErrors(
          'indicatorNew.form.data.attributes.end_date',
          { endDateBeforeStartDateError: formatMessage(appMessages.forms.endDateBeforeStartDateError) }
        ));
      } else {
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.end_date', { endDateBeforeStartDateError: false }));
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.start_date', { startDateAfterEndDateError: false }));
      }
      dispatch(formActions.change(dateModel, dateValue));
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: (formData, formatMessage) => {
      if (formData.$form.errors.endDatePresent) {
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.end_date', {
          required: true,
        }));
      }
      if (formData.$form.errors.startDatePresent) {
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.start_date', {
          required: true,
        }));
      }
      if (formData.$form.validity.endDatePresent && formData.$form.validity.startDatePresent && formData.$form.errors.endDateAfterStartDate) {
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.start_date', formatMessage(appMessages.forms.startDateAfterEndDateError)));
        dispatch(formActions.setErrors('indicatorNew.form.data.attributes.end_date', formatMessage(appMessages.forms.endDateBeforeStartDateError)));
      }
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData) => {
      let saveData = formData;
      // measures
      if (formData.get('associatedMeasures')) {
        saveData = saveData.set('measureIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedMeasures'))
          .map((id) => Map({
            measure_id: id,
          })),
        }));
      }
      if (formData.get('associatedSdgTargets')) {
        saveData = saveData.set('sdgtargetIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedSdgTargets'))
          .map((id) => Map({
            sdgtarget_id: id,
          })),
        }));
      }
      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }

      // cleanup
      // default to database id
      const formRef = formData.getIn(['attributes', 'reference']) || '';
      if (formRef.trim() === '') {
        saveData = saveData.setIn(['attributes', 'reference'], formData.get('id'));
      }
      if (!saveData.getIn(['attributes', 'repeat'])) {
        saveData = saveData
          .setIn(['attributes', 'frequency_months'], null)
          .setIn(['attributes', 'end_date'], null);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(PATHS.INDICATORS, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorNew);

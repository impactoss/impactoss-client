/*
 *
 * IndicatorEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  userOptions,
  entityOptions,
  renderMeasureControl,
  renderSdgTargetControl,
  renderUserControl,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
  getReferenceFormField,
  getStatusField,
  getMarkdownField,
  getDateField,
  getFrequencyField,
  getCheckboxField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

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
  deleteEntity,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectIsUserAdmin,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';


import {
  selectDomain,
  selectViewEntity,
  selectMeasures,
  selectSdgTargets,
  selectUsers,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';


export class IndicatorEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('indicatorEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('indicatorEdit.form.data', this.getInitialFormData(nextProps));
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.ScrollContainer) {
      scrollToTop(this.ScrollContainer);
    }
  }


  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { measures, viewEntity, users, sdgtargets } = props;
    let attributes = viewEntity.get('attributes');
    if (!attributes.get('reference')) {
      attributes = attributes.set('reference', viewEntity.get('id'));
    }
    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: attributes.mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedMeasures: entityOptions(measures, true),
      associatedSdgTargets: entityOptions(sdgtargets, true),
      associatedUser: userOptions(users, viewEntity.getIn(['attributes', 'manager_id'])),
      // TODO allow single value for singleSelect
    })
    : Map();
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage, appMessages, false, true),
        getTitleFormField(this.context.intl.formatMessage, appMessages, 'titleText'),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(this.context.intl.formatMessage, appMessages, entity),
        getMetaField(entity, appMessages),
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

  getBodyAsideFields = (entity, users, repeat) => ([ // fieldGroups
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
          entity,
          (model, value) => this.props.onRepeatChange(model, value, this.props.viewDomain.form.data, this.context.intl.formatMessage)
        ),
        repeat ? getFrequencyField(this.context.intl.formatMessage, appMessages, entity) : null,
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
          entity.getIn(['attributes', 'manager_id']),
        ),
      ],
    },
  ]);

  render() {
    const { viewEntity, dataReady, viewDomain, connectedTaxonomies, measures, users, sdgtargets, onCreateOption } = this.props;
    const { saveSending, saveError, deleteSending, deleteError, submitValid } = viewDomain.page;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content innerRef={(node) => { this.ScrollContainer = node; }} >
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="indicators"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('indicatorEdit.form.data'),
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
          {deleteError &&
            <Messages type="error" messages={deleteError} />
          }
          {(saveSending || deleteSending || !dataReady) &&
            <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady && !deleteSending &&
            <EntityForm
              model="indicatorEdit.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(formData, measures, sdgtargets)}
              handleSubmitFail={(formData) => this.props.handleSubmitFail(formData, this.context.intl.formatMessage)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              handleDelete={this.props.isUserAdmin ? this.props.handleDelete : null}
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
                  aside: this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(connectedTaxonomies, measures, sdgtargets, onCreateOption),
                  aside: this.getBodyAsideFields(viewEntity, users, viewDomain.form.data.getIn(['attributes', 'repeat'])),
                },
              }}
            />
          }
          { (saveSending || deleteSending) &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

IndicatorEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  users: PropTypes.object,
  onCreateOption: PropTypes.func,
  onRepeatChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
};

IndicatorEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  sdgtargets: selectSdgTargets(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  users: selectUsers(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    initialiseForm: (model, formData) => {
      // console.log('initialiseForm', formData)
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    onRepeatChange: (repeatModel, repeat, formData, formatMessage) => {
      // reset repeat erros when repeat turned off
      if (!repeat) {
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.start_date', {
          required: false,
          startDateAfterEndDateError: false,
        }));
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.end_date', {
          required: false,
          endDateBeforeStartDateError: false,
        }));
      } else if (validateRequired(formData.getIn(['attributes', 'start_date']))
        && validateRequired(formData.getIn(['attributes', 'end_date']))
        && !validateDateAfterDate(formData.getIn(['attributes', 'end_date']), formData.getIn(['attributes', 'start_date']))
      ) {
        dispatch(formActions.setErrors(
          'indicatorEdit.form.data.attributes.start_date',
          { startDateAfterEndDateError: formatMessage(appMessages.forms.startDateAfterEndDateError) }
        ));
        dispatch(formActions.setErrors(
          'indicatorEdit.form.data.attributes.end_date',
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
          'indicatorEdit.form.data.attributes.start_date',
          { startDateAfterEndDateError: formatMessage(appMessages.forms.startDateAfterEndDateError) }
        ));
      } else {
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.start_date', { startDateAfterEndDateError: false }));
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.end_date', { endDateBeforeStartDateError: false }));
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
          'indicatorEdit.form.data.attributes.end_date',
          { endDateBeforeStartDateError: formatMessage(appMessages.forms.endDateBeforeStartDateError) }
        ));
      } else {
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.end_date', { endDateBeforeStartDateError: false }));
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.start_date', { startDateAfterEndDateError: false }));
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
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.end_date', {
          required: true,
        }));
      }
      if (formData.$form.errors.startDatePresent) {
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.start_date', {
          required: true,
        }));
      }
      if (formData.$form.validity.endDatePresent && formData.$form.validity.startDatePresent && formData.$form.errors.endDateAfterStartDate) {
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.start_date', formatMessage(appMessages.forms.startDateAfterEndDateError)));
        dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.end_date', formatMessage(appMessages.forms.endDateBeforeStartDateError)));
      }
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData, measures, sdgtargets) => {
      let saveData = formData
        .set(
          'measureIndicators',
          getConnectionUpdatesFromFormData({
            formData,
            connections: measures,
            connectionAttribute: 'associatedMeasures',
            createConnectionKey: 'measure_id',
            createKey: 'indicator_id',
          })
        )
        .set(
          'sdgtargetIndicators',
          getConnectionUpdatesFromFormData({
            formData,
            connections: sdgtargets,
            connectionAttribute: 'associatedSdgTargets',
            createConnectionKey: 'sdgtarget_id',
            createKey: 'indicator_id',
          })
        );

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
      // do not store repeat fields when not repeat
      if (!saveData.getIn(['attributes', 'repeat'])) {
        saveData = saveData
          .setIn(['attributes', 'frequency_months'], null)
          .setIn(['attributes', 'end_date'], null);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`${PATHS.INDICATORS}/${props.params.id}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: 'indicators',
        id: props.params.id,
      }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorEdit);

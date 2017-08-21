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

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';
import validateDateAfterDate from 'components/forms/validators/validate-date-after-date';
import validatePresenceConditional from 'components/forms/validators/validate-presence-conditional';
import validateRequired from 'components/forms/validators/validate-required';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
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
  selectMeasuresCategorised,
  selectSdgTargetsCategorised,
} from 'containers/App/selectors';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

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
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
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
        renderMeasureControl(measures, connectedTaxonomies, onCreateOption),
        renderSdgTargetControl(sdgtargets, connectedTaxonomies, onCreateOption),
      ],
    },
  ]);

  getBodyAsideFields = (users, repeat) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.schedule),
      icon: 'reminder',
      fields: [
        getDateField(this.context.intl.formatMessage, appMessages, 'start_date', repeat, repeat ? 'start_date' : 'start_date_only'),
        getCheckboxField(this.context.intl.formatMessage, appMessages, 'repeat', null, (model, value) => this.props.resetValidityOnRepeatChange(model, value, this.props.viewDomain.form.data)),
        repeat ? getFrequencyField(this.context.intl.formatMessage, appMessages) : null,
        repeat ? getDateField(this.context.intl.formatMessage, appMessages, 'end_date', repeat) : null,
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
        <Content>
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
                onClick: () => this.props.handleSubmitRemote('indicatorNew.form.data'),
              }] : null
            }
          />
          {!submitValid &&
            <ErrorMessages
              error={{ messages: [this.context.intl.formatMessage(appMessages.forms.multipleErrors)] }}
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <ErrorMessages
              error={saveError}
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
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  users: PropTypes.object,
  onCreateOption: PropTypes.func,
  initialiseForm: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  resetValidityOnRepeatChange: PropTypes.func,
};

IndicatorNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
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
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    resetValidityOnRepeatChange: (repeatModel, repeat, formData) => {
      dispatch(formActions.setErrors('indicatorEdit.form.data.attributes.end_date', {
        required: repeat,
      }));
      dispatch(formActions.setErrors('indicatorNew.form.data.attributes.start_date', {
        required: repeat && !validateRequired(formData.getIn(['attributes', 'start_date'])),
      }));
      dispatch(formActions.change(repeatModel, repeat));
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
      dispatch(updatePath('/indicators'));
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

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

import { Map, List, fromJS } from 'immutable';

import {
  renderMeasureControl,
  renderRecommendationsByFwControl,
  renderUserControl,
  getTitleFormField,
  getReferenceFormField,
  getStatusField,
  getMarkdownField,
  getDateField,
  getFrequencyField,
  getCheckboxField,
  getConnectionUpdatesFromFormData,
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
  selectRecommendationsByFw,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class IndicatorNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('indicatorNew.form.data', FORM_INITIAL);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
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
          getReferenceFormField(intl.formatMessage, false, true),
          getTitleFormField(intl.formatMessage, 'titleText'),
        ],
      },
    ]);
  };

  getHeaderAsideFields = () => {
    const { intl } = this.context;
    return ([
      {
        fields: [
          getStatusField(intl.formatMessage),
        ],
      },
    ]);
  };

  getBodyMainFields = (
    connectedTaxonomies,
    measures,
    recommendationsByFw,
    onCreateOption,
  ) => {
    const { intl } = this.context;
    const groups = [];
    groups.push({
      fields: [getMarkdownField(intl.formatMessage)],
    });
    if (measures) {
      groups.push({
        label: intl.formatMessage(appMessages.nav.measuresSuper),
        icon: 'measures',
        fields: [
          renderMeasureControl(measures, connectedTaxonomies, onCreateOption, intl),
        ],
      });
    }
    if (recommendationsByFw) {
      const recConnections = renderRecommendationsByFwControl(
        recommendationsByFw,
        connectedTaxonomies,
        onCreateOption,
        intl,
      );
      if (recConnections) {
        groups.push(
          {
            label: intl.formatMessage(appMessages.nav.recommendationsSuper),
            icon: 'recommendations',
            fields: recConnections,
          },
        );
      }
    }
    return groups;
  };

  getBodyAsideFields = (users, repeat) => {
    const { intl } = this.context;
    return ([ // fieldGroups
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.due_dates.schedule),
        icon: 'reminder',
        fields: [
          getDateField(
            intl.formatMessage,
            'start_date',
            repeat,
            repeat ? 'start_date' : 'start_date_only',
            (model, value) => this.props.onStartDateChange(model, value, this.props.viewDomain.form.data, intl.formatMessage)
          ),
          getCheckboxField(
            intl.formatMessage,
            'repeat',
            (model, value) => this.props.onRepeatChange(model, value, this.props.viewDomain.form.data, intl.formatMessage)
          ),
          repeat ? getFrequencyField(intl.formatMessage) : null,
          repeat ? getDateField(
            intl.formatMessage,
            'end_date',
            repeat,
            'end_date',
            (model, value) => this.props.onEndDateChange(model, value, this.props.viewDomain.form.data, intl.formatMessage)
          )
            : null,
          renderUserControl(
            users,
            intl.formatMessage(appMessages.attributes.manager_id.indicators),
          ),
        ],
      },
    ]);
  };

  render() {
    const { intl } = this.context;
    const {
      dataReady,
      viewDomain,
      connectedTaxonomies,
      measures,
      recommendationsByFw,
      users,
      onCreateOption,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();

    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
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
                model="indicatorNew.form.data"
                formData={viewDomain.getIn(['form', 'data'])}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData, recommendationsByFw)}
                handleSubmitFail={(formData) => this.props.handleSubmitFail(formData, intl.formatMessage)}
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
                    main: this.getBodyMainFields(connectedTaxonomies, measures, recommendationsByFw, onCreateOption),
                    aside: this.getBodyAsideFields(users, viewDomain.getIn(['form', 'data', 'attributes', 'repeat'])),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
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
  recommendationsByFw: PropTypes.object,
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
  recommendationsByFw: selectRecommendationsByFw(state),
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
    handleSubmit: (formData, recommendationsByFw) => {
      let saveData = formData;
      // measures
      if (formData.get('associatedMeasures')) {
        saveData = saveData
          .set('measureIndicators', Map({
            delete: List(),
            create: getCheckedValuesFromOptions(formData.get('associatedMeasures'))
              .map((id) => Map({
                measure_id: id,
              })),
          }));
      }
      if (formData.get('associatedRecommendationsByFw') && recommendationsByFw) {
        saveData = saveData.set(
          'recommendationIndicators',
          recommendationsByFw
            .map((recs, fwid) => getConnectionUpdatesFromFormData({
              formData,
              connections: recs,
              connectionAttribute: ['associatedRecommendationsByFw', fwid.toString()],
              createConnectionKey: 'recommendation_id',
              createKey: 'indicator_id',
            }))
            .reduce(
              (memo, deleteCreateLists) => {
                const creates = memo.get('create').concat(deleteCreateLists.get('create'));
                return memo.set('create', creates);
              },
              fromJS({
                delete: [],
                create: [],
              }),
            )
        );
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

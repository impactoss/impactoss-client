/*
 *
 * IndicatorNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { Map, List, fromJS } from 'immutable';

import {
  entityOptions,
  userOptions,
  renderMeasureControl,
  renderRecommendationsByFwControl,
  renderUserControl,
  getTitleFormField,
  getReferenceFormField,
  getStatusField,
  getMarkdownFormField,
  getDateField,
  getFrequencyField,
  getCheckboxField,
  getConnectionUpdatesFromFormData,
} from 'utils/formik';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/formik/MultiSelectControl';
//import validateDateAfterDate from 'components/formik/validators/validate-date-after-date';
//import validatePresenceConditional from 'components/formik/validators/validate-presence-conditional';
//import validateRequired from 'components/formik/validators/validate-required';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectMeasuresCategorised,
  selectIndicatorReferences,
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
  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getInitialFormData = ({
    measures, users, recommendationsByFw,
  }) => FORM_INITIAL
    .set('associatedMeasures', entityOptions(measures, true))
    .set('associatedRecommendationsByFw', recommendationsByFw
      ? recommendationsByFw.map((recs) => entityOptions(recs, true))
      : Map())
    .set('associatedUser', userOptions(users, null))

  getHeaderMainFields = (existingReferences) => {
    const { intl } = this.props;
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          getReferenceFormField({
            formatMessage: intl.formatMessage,
            required: true,
            prohibitedValues: existingReferences,
          }),
          getTitleFormField(intl.formatMessage, 'titleText'),
        ],
      },
    ]);
  };

  getHeaderAsideFields = () => {
    const { intl } = this.props;
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
    const { intl } = this.props;
    const groups = [];
    groups.push({
      fields: [getMarkdownFormField({ formatMessage: intl.formatMessage })],
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
    if (recommendationsByFw && recommendationsByFw.size > 0) {
      const recConnections = renderRecommendationsByFwControl(
        recommendationsByFw,
        connectedTaxonomies,
        onCreateOption,
        intl,
      );

      if (recConnections && recConnections.lenght > 0) {
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
    const { intl } = this.props;
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
            (model, value) =>
              this.props.onStartDateChange(
                model, value, this.props.viewDomain.getIn(['form', 'data']), intl.formatMessage
              ) 
          ),
          getCheckboxField(
            intl.formatMessage,
            'repeat',
            (model, value) => this.props.onRepeatChange(
              model, value, this.props.viewDomain.getIn(['form', 'data']), intl.formatMessage,
            )
          ),
          repeat ? getFrequencyField(intl.formatMessage) : null,
          repeat ? getDateField(
            intl.formatMessage,
            'end_date',
            repeat,
            'end_date',
            (model, value) => this.props.onEndDateChange(
              model, value, this.props.viewDomain.getIn(['form', 'data']), intl.formatMessage,
            )
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
    const {
      dataReady,
      viewDomain,
      connectedTaxonomies,
      measures,
      recommendationsByFw,
      users,
      onCreateOption,
      existingReferences,
      intl,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();

    return (
      <div>
        <HelmetCanonical
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
          {(saveSending || !dataReady)
            && <Loading />
          }
          {dataReady
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(formData, recommendationsByFw)}
                handleSubmitFail={this.props.handleSubmitFail()}
                handleCancel={this.props.handleCancel}
                /*validators={{
                  '': {
                  // Form-level validator
                    endDatePresent: (vals) => validatePresenceConditional(vals.getIn(['attributes', 'repeat']), vals.getIn(['attributes', 'end_date'])),
                    startDatePresent: (vals) => validatePresenceConditional(vals.getIn(['attributes', 'repeat']), vals.getIn(['attributes', 'start_date'])),
                    endDateAfterStartDate: (vals) => vals.getIn(['attributes', 'repeat']) ? validateDateAfterDate(vals.getIn(['attributes', 'end_date']), vals.getIn(['attributes', 'start_date'])) : true,
                  },
                }}*/
                fields={{
                  header: {
                    main: this.getHeaderMainFields(existingReferences),
                    aside: this.getHeaderAsideFields(),
                  },
                  body: {
                    main: this.getBodyMainFields(connectedTaxonomies, measures, recommendationsByFw, onCreateOption),
                    aside: this.getBodyAsideFields(users, viewDomain.getIn(['attributes', 'repeat'])),
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
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  measures: PropTypes.object,
  recommendationsByFw: PropTypes.object,
  users: PropTypes.object,
  onCreateOption: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onRepeatChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  existingReferences: PropTypes.array,
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
  existingReferences: selectIndicatorReferences(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    /* TODO: bring back 2 field dependent validators
    onRepeatChange: (repeat, formData, formatMessage) => {
      let errors = {};
      if (repeat
        && validateRequired(formData.getIn(['attributes', 'start_date']))
        && validateRequired(formData.getIn(['attributes', 'end_date']))
        && !validateDateAfterDate(formData.getIn(['attributes', 'end_date']), formData.getIn(['attributes', 'start_date']))
      ) {
        errors.start_date = formatMessage(appMessages.forms.startDateAfterEndDateError);
        errors.end_date = formatMessage(appMessages.forms.endDateBeforeStartDateError)
      }
      return errors;
    },
    onStartDateChange: (dateValue, formData, formatMessage) => {
      let errors = {};
      if (formData.getIn(['attributes', 'repeat'])
        && validateRequired(formData.getIn(['attributes', 'end_date']))
        && validateRequired(dateValue)
        && !validateDateAfterDate(formData.getIn(['attributes', 'end_date']), dateValue)
      ) {
        errors.start_date = formatMessage(appMessages.forms.startDateAfterEndDateError)
      }
      return errors;
    },
    onEndDateChange: (dateValue, formData, formatMessage) => {
      let errors = {};
      if (formData.getIn(['attributes', 'repeat'])
        && validateRequired(dateValue)
        && validateRequired(formData.getIn(['attributes', 'start_date']))
        && !validateDateAfterDate(dateValue, formData.getIn(['attributes', 'start_date']))
      ) {
        errors.end_date = formatMessage(appMessages.forms.endDateBeforeStartDateError);
      }
    },*/
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmit: (formValues, recommendationsByFw) => {
      const formData = fromJS(formValues);
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
      dispatch(updatePath(ROUTES.INDICATORS, { replace: true }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(IndicatorNew));

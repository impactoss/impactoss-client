/*
 *
 * IndicatorEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Map, List, fromJS } from 'immutable';

import {
  userOptions,
  entityOptions,
  renderMeasureControl,
  renderRecommendationsByFwControl,
  renderUserControl,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
  getReferenceFormField,
  getStatusField,
  getMarkdownFormField,
  getDateField,
  modifyStartDateField,
  getFrequencyField,
  getCheckboxField,
} from 'utils/formik';

import {
  getMetaField,
} from 'utils/fields';
import { canUserDeleteEntities } from 'utils/permissions';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/formik/MultiSelectControl';
import validateDateAfterDate from 'components/formik/validators/validate-date-after-date';
import validateRequired from 'components/formik/validators/validate-required';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  deleteEntity,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectIsUserAdmin,
  selectSessionUserHighestRoleId,
  selectIndicatorReferences,
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
  selectRecommendationsByFw,
  selectUsers,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

const STATE_INITIAL = {
  repeat: null,
};
export class IndicatorEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
    this.remoteSubmitForm = null;
    this.state = STATE_INITIAL;
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
  componentDidMount() {
    if (this.props.dataReady && this.props.viewEntity && this.state.repeat === null) {
      this.setState({ repeat: this.props.viewEntity.getIn(['attributes', 'repeat']) || false });
    }
  }

  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getInitialFormData = ({ measures, viewEntity, users, recommendationsByFw }) => {
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
        associatedRecommendationsByFw: recommendationsByFw
          ? recommendationsByFw.map((recs) => entityOptions(recs, true))
          : Map(),
        associatedUser: userOptions(users, viewEntity.getIn(['attributes', 'manager_id'])),
      // TODO allow single value for singleSelect
      })
      : Map();
  };

  getHeaderMainFields = (existingReferences, intl) =>
    ([ // fieldGroups
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

  getHeaderAsideFields = (entity, intl) =>
    ([
      {
        fields: [
          getStatusField(intl.formatMessage),
          getMetaField(entity),
        ],
      },
    ]);

  getBodyMainFields = (connectedTaxonomies, measures, recommendationsByFw, onCreateOption, intl) => {
    const groups = [];
    groups.push(
      {
        fields: [getMarkdownFormField({ formatMessage: intl.formatMessage })],
      },
    );
    if (measures) {
      groups.push(
        {
          label: intl.formatMessage(appMessages.nav.measuresSuper),
          icon: 'measures',
          fields: [
            renderMeasureControl(measures, connectedTaxonomies, onCreateOption, intl),
          ],
        },
      );
    }
    if (recommendationsByFw && recommendationsByFw.size > 0) {
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

  getBodyAsideFields = (entity, users, intl) => {
    const repeat = entity.getIn(['attributes', 'repeat']) || false;
    return ([// fieldGroups
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.due_dates.schedule),
        icon: 'reminder',
        fields: [
          getDateField({
            formatMessage: intl.formatMessage,
            attribute: 'start_date',
            repeat,
            label: repeat ? 'start_date' : 'start_date_only',
            modifyFieldAttributes: 
            (field, formData) =>
              modifyStartDateField(
                field,
                this.props.isRepeat(formData),
                this.props.intl,
              ),
          }),
          getCheckboxField(
            intl.formatMessage,
            'repeat',
            repeat
          ),
          getFrequencyField(
            intl.formatMessage,
            (formData) => !this.props.isRepeat(formData)
          ),
          getDateField({
            formatMessage: intl.formatMessage,
            attribute: 'end_date',
            repeat,
            label: 'end_date',
            dynamicValidators: (value, formData) =>
              this.props.onEndDateChange(
                value,
                formData,
                intl.formatMessage,
              ),
            isFieldDisabled: (formData) => !this.props.isRepeat(formData),
          }),
          renderUserControl(
            users,
            intl.formatMessage(appMessages.attributes.manager_id.indicators),
            entity.getIn(['attributes', 'manager_id']),
          ),
        ],
      },
    ]);
  }

  render() {
    const {
      viewEntity,
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
    const {
      saveSending, saveError, deleteSending, deleteError, submitValid,
    } = viewDomain.get('page').toJS();
    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
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
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  measures,
                  recommendationsByFw,
                  viewEntity,
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                handleDelete={canUserDeleteEntities(this.props.highestRole) ? this.props.handleDelete : null}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(
                      existingReferences
                        ? existingReferences.filter((r) => r !== viewEntity.getIn(['attributes', 'reference']))
                        : null,
                      intl
                    ),
                    aside: this.getHeaderAsideFields(viewEntity, intl),
                  },
                  body: {
                    main: this.getBodyMainFields(connectedTaxonomies, measures, recommendationsByFw, onCreateOption, intl),
                    aside: this.getBodyAsideFields(viewEntity, users, intl),
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

IndicatorEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
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
  recommendationsByFw: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  users: PropTypes.object,
  highestRole: PropTypes.number,
  onCreateOption: PropTypes.func,
  onRepeatChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  existingReferences: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  recommendationsByFw: selectRecommendationsByFw(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  users: selectUsers(state),
  highestRole: selectSessionUserHighestRoleId(state),
  existingReferences: selectIndicatorReferences(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    isRepeat: (formData) => formData.attributes.repeat,
    onEndDateChange: (dateValue, formValues, formatMessage) => {
      const formData = fromJS(formValues);
      let errors;
      if (formData.getIn(['attributes', 'repeat'])
        && validateRequired(dateValue)
        && validateRequired(formData.getIn(['attributes', 'start_date']))
        && !validateDateAfterDate(dateValue, formData.getIn(['attributes', 'start_date']))
      ) {
        errors = formatMessage(appMessages.forms.endDateBeforeStartDateError);
      } 
      return errors;
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
    handleSubmit: (formValues, measures, recommendationsByFw, viewEntity) => {
      const formData = fromJS(formValues);
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
        );
      saveData = saveData.set(
        'recommendationIndicators',
        recommendationsByFw
          .map((recs, fwid) => getConnectionUpdatesFromFormData({
            formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
            connections: recs,
            connectionAttribute: ['associatedRecommendationsByFw', fwid.toString()],
            createConnectionKey: 'recommendation_id',
            createKey: 'indicator_id',
          }))
          .reduce(
            (memo, deleteCreateLists) => {
              const deletes = memo.get('delete').concat(deleteCreateLists.get('delete'));
              const creates = memo.get('create').concat(deleteCreateLists.get('create'));
              return memo
                .set('delete', deletes)
                .set('create', creates);
            },
            fromJS({
              delete: [],
              create: [],
            }),
          )
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
      // check if attributes have changed
      if (saveData.get('attributes').equals(viewEntity.get('attributes'))) {
        saveData = saveData.set('skipAttributes', true);
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`${ROUTES.INDICATORS}/${props.params.id}`, { replace: true }));
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(IndicatorEdit));

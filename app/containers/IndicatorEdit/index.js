/*
 *
 * IndicatorEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List, fromJS } from 'immutable';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES } from 'containers/App/constants';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import {
  userOptions,
  entityOptions,
  renderActionControl,
  renderUserControl,
} from 'utils/forms';

import viewDomainSelect from './selectors';

import messages from './messages';
import { save } from './actions';

export class IndicatorEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.indicator) {
      this.props.populateForm('indicatorEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.indicator) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('indicatorEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { actions, indicator, users } = props;
    return indicator
    ? Map({
      id: indicator.id,
      attributes: fromJS(indicator.attributes),
      associatedActions: entityOptions(actions, true),
      associatedUser: userOptions(users, indicator.attributes.manager_id),
      // TODO allow single value for singleSelect
    })
    : Map();
  }

  render() {
    const { indicator, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;
    const required = (val) => val && val.length;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !indicator && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !indicator && dataReady && !saveError &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {indicator &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'primary',
                title: 'Save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                  this.props.actions,
                ),
              },
            ]}
          >
            {saveSending &&
              <p>Saving</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }
            <EntityForm
              model="indicatorEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                this.props.actions
              )}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.attributes.title',
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: [
                    {
                      id: 'no',
                      controlType: 'info',
                      displayValue: reference,
                    },
                    {
                      id: 'status',
                      controlType: 'select',
                      model: '.attributes.draft',
                      value: indicator.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: indicator.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: indicator.user && indicator.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.attributes.description',
                    },
                    renderActionControl(this.props.actions),
                  ],
                  aside: [
                    renderUserControl(this.props.users, 'Assigned user', indicator.attributes.manager_id),
                    {
                      id: 'start',
                      controlType: 'input',
                      label: 'Reporting due date',
                      model: '.attributes.start_date',
                      placeholder: 'YYYY-MM-DD',
                    },
                    {
                      id: 'repeat',
                      controlType: 'checkbox',
                      label: 'Repeat?',
                      model: '.attributes.repeat',
                    },
                    {
                      id: 'frequency',
                      controlType: 'input',
                      label: 'Reporting frequency in months',
                      model: '.attributes.frequency_months',
                    },
                    {
                      id: 'end',
                      controlType: 'input',
                      label: 'Reporting end date',
                      model: '.attributes.end_date',
                      placeholder: 'YYYY-MM-DD',
                    },
                  ],
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

IndicatorEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  indicator: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  actions: PropTypes.object,
  users: PropTypes.object,
};

IndicatorEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'user_roles',
    'indicators',
    'measure_indicators',
  ] }),

  indicator: getEntity(
    state,
    {
      id: props.params.id,
      path: 'indicators',
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
      ],
    },
  ),

  // all recommendations, listing connection if any
  actions: getEntities(
    state,
    {
      path: 'measures',
      extend: {
        as: 'associated',
        path: 'measure_indicators',
        key: 'measure_id',
        reverse: true,
        where: {
          indicator_id: props.params.id,
        },
      },
    },
  ),

  // all users of role contributor
  users: getEntities(
    state,
    {
      path: 'users',
      connected: {
        path: 'user_roles',
        key: 'user_id',
        where: {
          role_id: USER_ROLES.CONTRIBUTOR, // contributors only
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    populateForm: (model, formData) => {
      // console.log('populateForm', formData)
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData, actions) => {
      // actions
      const formActionIds = getCheckedValuesFromOptions(formData.get('associatedActions'));
      // store associated Actions as { [action.id]: [association.id], ... }
      const associatedActions = actions.reduce((actionsAssociated, action) => {
        if (action.get('associated')) {
          return actionsAssociated.set(action.get('id'), action.get('associated').keySeq().first());
        }
        return actionsAssociated;
      }, Map());


      let saveData = formData.set('measureIndicators', Map({
        delete: associatedActions.reduce((associatedIds, associatedId, id) =>
          !formActionIds.includes(id)
            ? associatedIds.push(associatedId)
            : associatedIds
        , List()),
        create: formActionIds.reduce((payloads, id) =>
          !associatedActions.has(id)
            ? payloads.push(Map({
              measure_id: id,
              indicator_id: formData.get('id'),
            }))
            : payloads
        , List()),
      }));

      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }

      // cleanup
      if (!saveData.getIn(['attributes', 'repeat'])) {
        saveData = saveData
          .setIn(['attributes', 'frequency_months'], null)
          .setIn(['attributes', 'end_date'], null);
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`/indicators/${props.params.id}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorEdit);

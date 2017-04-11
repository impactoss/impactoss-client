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
import { browserHistory } from 'react-router';

import { Map, List, fromJS } from 'immutable';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import {
  pageSelector,
  formSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class IndicatorEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady) {
      this.props.populateForm('indicatorEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('indicatorEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { actions, indicator } = props;
    return Map({
      id: indicator.id,
      attributes: fromJS(indicator.attributes),
      associatedActions: actions
        ? actions.reduce((ids, entity) => entity.get('associated') ? ids.push(entity.get('id')) : ids, List())
        : List(),
      associatedUser: indicator.attributes.manager_id ? List().push(indicator.attributes.manager_id.toString()) : List(),
      // TODO allow single value for singleSelect
    });
  }

  mapActionOptions = (entities) => entities.toList().map((entity) => Map({
    value: entity.get('id'),
    label: entity.getIn(['attributes', 'title']),
  }));

  mapUserOptions = (entities) => entities.toList().map((entity) => Map({
    value: entity.get('id'),
    label: entity.getIn(['attributes', 'name']),
  }));

  // TODO this should be shared functionality
  renderActionControl = (actions) => ({
    id: 'actions',
    model: '.associatedActions',
    label: 'Actions',
    controlType: 'multiselect',
    options: this.mapActionOptions(actions),
  });
  renderUserControl = (users) => ({
    id: 'users',
    model: '.associatedUser',
    label: 'Indicator manager',
    controlType: 'multiselect',
    options: this.mapUserOptions(users),
  });


  render() {
    const { indicator, dataReady } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = this.props.page;
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
                  this.props.form.data,
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
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                this.props.actions
              )}
              handleCancel={this.props.handleCancel}
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
                    this.props.actions ? this.renderActionControl(this.props.actions) : null,
                  ],
                  aside: [
                    this.props.users ? this.renderUserControl(this.props.users) : null,
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
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
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
  page: pageSelector(state),
  form: formSelector(state),
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
          role_id: 2, // contributors only TODO: from constants
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
    populateForm: (model, formData) => {
      // console.log('populateForm', formData)
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData, actions) => {
      // actions
      const formActionIds = formData.get('associatedActions');
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
      if (List.isList(saveData.get('associatedUser'))) {
        saveData = saveData.setIn(['attributes', 'manager_id'], saveData.get('associatedUser').first());
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/indicators/${props.params.id}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorEdit);

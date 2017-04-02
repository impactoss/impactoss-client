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
import { reduce } from 'lodash/collection';

import { fromJS } from 'immutable';

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
    // console.log('componentWillMount', this.props.indicator, this.props.dataReady)
    if (this.props.indicator && this.props.dataReady) {
      this.props.populateForm('indicatorEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props)
    // repopulate if new data becomes ready
    if (nextProps.indicator && nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('indicatorEdit.form.data', this.getInitialFormData(nextProps));
    }
    // reload entities if invalidated
    if (this.props.indicator && !nextProps.indicator && !nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const data = {
      id: props.indicator.id,
      attributes: props.indicator.attributes,
    };

    const { actions } = this.props;

    // TODO this functionality should be shared
      // Reducer - starts with {}, iterate taxonomies, and store associated ids as { [tax.id]: [associated,category,ids], ... }
    data.associatedActions = actions
      ? Object.values(actions).reduce((ids, action) =>
          action.associated ? ids.concat([action.id]) : ids
        , [])
      : [];

    return data;
  }

  mapActionOptions = (actions) => Object.values(actions).map((action) => ({
    value: action.id,
    label: action.attributes.title,
  }));

  // TODO this should be shared functionality
  renderActionControl = (actions) => actions ? ({
    id: 'actions',
    model: '.associatedActions',
    label: 'Actions',
    controlType: 'multiselect',
    options: this.mapActionOptions(actions),
  }) : [];


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
                    this.renderActionControl(this.props.actions),
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
    'indicators',
    'measure_indicators',
  ] }),

  indicator: getEntity(
    state,
    {
      id: props.params.id,
      path: 'indicators',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),

  // all recommendations, listing connection if any
  actions: getEntities(
    state,
    {
      path: 'measures',
      out: 'js',
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
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
    },
    populateForm: (model, formData) => {
      // console.log('populateForm', formData)
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData, actions) => {
      // TODO maybe this function should be updated to work with Immutable objects, instead of converting
      // const prevTaxonomies = prevFormData.associatedTaxonomies || {};
      const saveData = formData.toJS();

      // measures
      const formActionIds = saveData.associatedActions;
      // store associated recs as { [rec.id]: [association.id], ... }
      const associatedActions = Object.values(actions).reduce((actionsAssociated, action) => {
        const result = actionsAssociated;
        if (action.associated) {
          result[action.id] = Object.keys(action.associated)[0];
        }
        return result;
      }, {});

      saveData.measureIndicators = {
        delete: reduce(associatedActions, (associatedIds, associatedId, actionId) =>
          formActionIds.indexOf(actionId.toString()) === -1
            ? associatedIds.concat([associatedId])
            : associatedIds
        , []),
        create: reduce(formActionIds, (payloads, actionId) =>
          Object.keys(associatedActions).indexOf(actionId.toString()) === -1
            ? payloads.concat([{
              measure_id: actionId,
              indicator_id: saveData.id,
            }])
            : payloads
        , []),
      };

      dispatch(save(saveData));
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

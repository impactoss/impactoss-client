/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { browserHistory } from 'react-router';
import collection from 'lodash/collection';

import { fromJS } from 'immutable';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/EntityForm';

import {
  entitySelect,
  entitiesSelect,
  entitiesReadySelector,
} from 'containers/App/selectors';

import {
  pageSelector,
  formSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class ActionEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.action && this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', fromJS(this.props.action.attributes));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action && nextProps.actionsReady && !this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', fromJS(nextProps.action.attributes));
    }
  }

  render() {
    const { action, actionsReady } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = this.props.page;
    const required = (val) => val && val.length;
    // console.log(JSON.stringify(this.props.action))
    const taxonomyOptions = collection.map(this.props.taxonomiesExtended, (tax) => ({
      id: tax.attributes.title,
      controlType: 'select',
      options: collection.map(tax.categories, (cat) => ({
        value: cat.id,
        label: `${cat.attributes.title}${cat.assigned ? ' - assigned' : ' - not assigned'}`,
      })),
    }));

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !action && !actionsReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !action && actionsReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {action &&
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
                onClick: () => this.props.handleSubmit(this.props.form.action),
              },
            ]}
          >
            <EntityForm
              model="actionEdit.form.action"
              handleSubmit={this.props.handleSubmit}
              handleCancel={this.props.handleCancel}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.title',
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
                      model: '.draft',
                      value: action.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: action.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: action.user && action.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.description',
                    },
                    {
                      id: 'recommendations',
                      controlType: 'select',
                      options: collection.map(this.props.recommendations, (rec) => ({
                        value: rec.id,
                        label: rec.attributes.title,
                      })),
                    },
                  ],
                  aside: taxonomyOptions,
                },
              }}
            />
          </Page>
        }
        {saveSending &&
          <p>Saving</p>
        }
        {saveError &&
          <p>{saveError}</p>
        }
      </div>
    );
  }
}

ActionEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
  action: PropTypes.object,
  actionsReady: PropTypes.bool,
  params: PropTypes.object,
  taxonomiesExtended: PropTypes.object,
  recommendations: PropTypes.object,
};

ActionEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  action: entitySelect(
    state,
    {
      id: props.params.id,
      path: 'actions',
      out: 'js',
      extend: {
        type: 'id',
        path: 'users',
        on: 'last_modified_user_id',
        reverse: true,
        as: 'user',
      },
    },
  ),
  actionsReady: entitiesReadySelector(state, { path: 'actions' }),
  page: pageSelector(state),
  form: formSelector(state),
  taxonomiesExtended: entitiesSelect(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_measures: true,
      },
      extend: {
        path: 'categories',
        on: 'taxonomy_id',
        extend: {
          path: 'measure_categories',
          on: 'category_id',
          as: 'assigned',
          where: {
            action_id: props.params.id,
          },
        },
      },
      out: 'js',
    },
  ),
  recommendations: entitiesSelect(
    state, {
      path: 'recommendations',
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
    },
    populateForm: (model, data) => {
      dispatch(formActions.load(model, data));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData, props.params.id));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/actions/${props.params.id}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

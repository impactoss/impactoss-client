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


// import { actions as formActions } from 'react-redux-form';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/EntityForm';

import {
  makeEntityMapSelector,
  makeEntitiesReadySelector,
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
      this.props.populateForm('actionEdit.form.action', this.props.action.get('attributes'));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action && nextProps.actionsReady && !this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', nextProps.action.get('attributes'));
    }
  }

  render() {
    const { action, actionsReady } = this.props;
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
                      value: action && action.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: action && action.get('attributes').get('updated_at'),
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: action && action.get('attributes').get('last_modified_user'),
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
                  ],
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
};

ActionEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const makeMapStateToProps = () => {
  const getEntity = makeEntityMapSelector();
  const entitiesReady = makeEntitiesReadySelector();
  const mapStateToProps = (state, props) => ({
    action: getEntity(state, { id: props.params.id, path: 'actions' }),
    actionsReady: entitiesReady(state, { path: 'actions' }),
    page: pageSelector(state),
    form: formSelector(state),
  });
  return mapStateToProps;
};

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
      dispatch(loadEntitiesIfNeeded('users'));
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

export default connect(makeMapStateToProps, mapDispatchToProps)(ActionEdit);

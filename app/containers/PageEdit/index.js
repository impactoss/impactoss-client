/*
 *
 * PageEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { fromJS } from 'immutable';

import { PUBLISH_STATUSES, USER_ROLES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, redirectIfNotPermitted, updatePath } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getEntity,
  isReady,
} from 'containers/App/selectors';

import {
  pageSelector,
  formSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class PageEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady) {
      this.props.populateForm('pageEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('pageEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { page } = props;
    return fromJS(page);
  }

  render() {
    const { page, dataReady } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = this.props.pageData;
    const required = (val) => val && val.length;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !page && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !page && dataReady && !saveError &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {page &&
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
                onClick: () => this.props.handleSubmit(this.props.form.data),
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
              model="pageEdit.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
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
                    {
                      id: 'menuTitle',
                      controlType: 'input',
                      label: 'Menu title',
                      model: '.attributes.menu_title',
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
                      value: page.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: page.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: page.user && page.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'content',
                      controlType: 'textarea',
                      model: '.attributes.content',
                    },
                  ],
                  aside: [],
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

PageEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  pageData: PropTypes.object,
  form: PropTypes.object,
  page: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
};

PageEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  pageData: pageSelector(state),
  form: formSelector(state),
  dataReady: isReady(state, { path: [
    'users',
    'pages',
  ] }),

  page: getEntity(
    state,
    {
      id: props.params.id,
      path: 'pages',
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
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('pages'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.ADMIN));
    },
    populateForm: (model, formData) => {
      // console.log('populateForm', formData)
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData.toJS()));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      dispatch(updatePath(`/pages/${props.params.id}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEdit);

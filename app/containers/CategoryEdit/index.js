/*
 *
 * CategoryEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { browserHistory } from 'react-router';

import { fromJS } from 'immutable';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/EntityForm';

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

export class CategoryEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.category && this.props.categoriesReady) {
      this.props.populateForm('categoryEdit.form.category', fromJS(this.props.category.attributes));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.category && nextProps.categoriesReady && !this.props.categoriesReady) {
      this.props.populateForm('categoryEdit.form.category', fromJS(nextProps.category.attributes));
    }
  }

  render() {
    const { category, categoriesReady } = this.props;
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
        { !category && !categoriesReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !category && categoriesReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {category &&
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
                onClick: () => this.props.handleSubmit(this.props.form.category),
              },
            ]}
          >
            <EntityForm
              model="categoryEdit.form.category"
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
                      id: 'updated',
                      controlType: 'info',
                      displayValue: category.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: category.user && category.user.attributes.name,
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
                      id: 'short_title',
                      controlType: 'input',
                      model: '.short_title',
                    },
                    {
                      id: 'url',
                      controlType: 'input',
                      model: '.url',
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

CategoryEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
  category: PropTypes.object,
  categoriesReady: PropTypes.bool,
  params: PropTypes.object,
};

CategoryEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  page: pageSelector(state),
  form: formSelector(state),
  categoriesReady: isReady(state, { path: 'categories' }),
  category: getEntity(
    state,
    {
      id: props.params.id,
      path: 'categories',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('categories'));
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
      browserHistory.push(`/categories/${props.params.id}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit);

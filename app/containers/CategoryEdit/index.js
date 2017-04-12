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

import { Map, List, fromJS } from 'immutable';

import { getCheckedValuesFromOptions } from 'components/MultiSelect';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';
import { USER_ROLES } from 'containers/App/constants';

import {
  getEntity,
  getEntities,
  isReady,
  isUserAdmin,
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

    if (this.props.dataReady) {
      this.props.populateForm('categoryEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('categoryEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { category } = props;
    return Map({
      id: category.id,
      attributes: fromJS(category.attributes),
      associatedUser: category.attributes.manager_id ? List().push(Map({
        value: category.attributes.manager_id.toString(),
        checked: true,
      })) : List(),
      // TODO allow single value for singleSelect
    });
  }

  mapUserOptions = (entities) => entities.toList().map((entity) => Map({
    value: Map({ value: entity.get('id') }),
    label: entity.getIn(['attributes', 'name']),
  }));

  renderUserControl = (users) => ({
    id: 'users',
    model: '.associatedUser',
    label: 'Category manager',
    controlType: 'multiselect',
    options: this.mapUserOptions(users),
  });

  render() {
    const { category, dataReady, isAdmin } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = this.props.page;
    const required = (val) => val && val.length;

    const mainAsideFields = [];
    if (dataReady && isAdmin && !!category.taxonomy.attributes.has_manager && this.props.users) {
      mainAsideFields.push(this.renderUserControl(this.props.users));
    }

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !category && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !category && dataReady && !saveError &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {category && dataReady &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Cancel',
                onClick: () => this.props.handleCancel(reference),
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
              model="categoryEdit.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={() => this.props.handleCancel(reference)}
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
                      model: '.attributes.description',
                    },
                    {
                      id: 'short_title',
                      controlType: 'input',
                      model: '.attributes.short_title',
                    },
                    {
                      id: 'url',
                      controlType: 'input',
                      model: '.attributes.url',
                    },
                  ],
                  aside: mainAsideFields,
                },
              }}
            />
          </Page>
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
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  params: PropTypes.object,
  users: PropTypes.object,
};

CategoryEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAdmin: isUserAdmin(state),
  page: pageSelector(state),
  form: formSelector(state),
  dataReady: isReady(state, { path: [
    'users',
    'user_roles',
    'categories',
    'taxonomies',
  ] }),
  category: getEntity(
    state,
    {
      id: props.params.id,
      path: 'categories',
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
        {
          type: 'single',
          path: 'taxonomies',
          key: 'taxonomy_id',
          as: 'taxonomy',
        },
      ],
    },
  ),
  // all users of role manager
  users: getEntities(
    state,
    {
      path: 'users',
      connected: {
        path: 'user_roles',
        key: 'user_id',
        where: {
          role_id: USER_ROLES.MANAGER, // managers only TODO: from constants
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData) => {
      let saveData = formData;
      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (reference) => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/category/${reference}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit);

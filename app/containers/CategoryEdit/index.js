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

import { Map, List, fromJS } from 'immutable';

import {
  userOptions,
  renderUserControl,
  validateRequired,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import {
  getEntity,
  getEntities,
  isReady,
  isUserAdmin,
} from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';

import messages from './messages';
import { save } from './actions';

export class CategoryEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.dataReady && this.props.category) {
      this.props.populateForm('categoryEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.category) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('categoryEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { category, users } = props;
    return category
    ? Map({
      id: category.id,
      attributes: fromJS(category.attributes),
      associatedUser: userOptions(users, category.attributes.manager_id),
      // TODO allow single value for singleSelect
    })
    : Map();
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'number',
          controlType: 'short',
          model: '.attributes.reference',
          label: this.context.intl.formatMessage(appMessages.attributes.referenceOptional),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.referenceOptional),
        },
        {
          id: 'title',
          controlType: 'title',
          model: '.attributes.title',
          label: this.context.intl.formatMessage(appMessages.attributes.title),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.title),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
        {
          id: 'short_title',
          controlType: 'short',
          model: '.attributes.short_title',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.short_title),
          label: this.context.intl.formatMessage(appMessages.attributes.short_title),
        },
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        {
          controlType: 'info',
          type: 'meta',
          fields: [
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
              value: this.context.intl.formatDate(new Date(entity.attributes.updated_at)),
            },
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
              value: entity.user && entity.user.attributes.name,
            },
          ],
        },
      ],
    },
  ]);
  getBodyMainFields = () => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          label: this.context.intl.formatMessage(appMessages.attributes.description),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
        },
      ],
    },
  ]);
  getBodyAsideFields = (entity, users, isAdmin) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [{
        id: 'url',
        controlType: 'url',
        model: '.attributes.url',
        label: this.context.intl.formatMessage(appMessages.attributes.url),
        placeholder: this.context.intl.formatMessage(appMessages.placeholders.url),
      }],
    });
    if (isAdmin && !!entity.taxonomy.attributes.has_manager) {
      fields.push({
        fields: [
          renderUserControl(
            users,
            this.context.intl.formatMessage(appMessages.attributes.manager_id.categories),
            entity.attributes.manager_id
          ),
        ],
      });
    }
    return fields;
  }

  getFields = (entity, users, isAdmin) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(),
      aside: this.getBodyAsideFields(entity, users, isAdmin),
    },
  })

  render() {
    const { category, dataReady, isAdmin, viewDomain, users } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={
              category && dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data),
              }] : null
            }
          />
          {saveSending &&
            <p>Saving</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !category && !dataReady &&
            <Loading />
          }
          { !category && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {category && dataReady &&
            <EntityForm
              model="categoryEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(category, users, isAdmin)}
            />
          }
        </Content>
      </div>
    );
  }
}

CategoryEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
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
  viewDomain: viewDomainSelect(state),
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
          role_id: USER_ROLES.MANAGER, // managers only
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
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
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
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }
      // default to database id
      const formRef = formData.getIn(['attributes','reference'])
        ? formData.getIn(['attributes','reference']).trim()
        : ''
      if(formRef === '') {
        saveData = saveData.setIn(['attributes','reference'], formData.get('id'));
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`/category/${reference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit);

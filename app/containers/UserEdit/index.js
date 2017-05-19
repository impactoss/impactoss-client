/*
 *
 * UserEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { Map, List, fromJS } from 'immutable';
import { map } from 'lodash/collection';

import {
  taxonomyOptions,
  validateRequired,
  // renderTaxonomyControl,
} from 'utils/forms';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';
import {
  getUser,
  getEntities,
  isReady,
  isUserManager,
} from 'containers/App/selectors';

import { CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';
import { save } from './actions';
import messages from './messages';

export class UserEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.user) {
      this.props.populateForm('userEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.user) {
      this.props.populateForm('userEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, user } = props;

    return Map({
      id: user.id,
      attributes: fromJS(user.attributes),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRole: this.getHighestUserRoleId(user.roles),
    });
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'name',
          controlType: 'title',
          model: '.attributes.name',
          label: this.context.intl.formatMessage(appMessages.attributes.name),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
      ],
    },
  ]);

  getRoleOptions = (roles) => {
    const roleOptions = [
      {
        value: 0,
        label: this.context.intl.formatMessage(appMessages.entities.roles.defaultRole),
      },
    ];
    return Object.values(roles).reduce((memo, role) =>
      memo.concat([
        {
          value: parseInt(role.id, 10),
          label: role.attributes.friendly_name,
        },
      ])
    , roleOptions);
  }

  // only show the highest rated role (lower role ids means higher)
  getHighestUserRoleId = (userRoles) => {
    if (userRoles) {
      const highestRole = Object.values(userRoles).reduce((currentHighestRole, role) =>
        !currentHighestRole || role.role.id < currentHighestRole.id
        ? role.role
        : currentHighestRole
      , null);
      return highestRole.id;
    }
    return 0;
  }
  // only show the highest rated role (lower role ids means higher)
  getHighestUserRoleLabel = (roles) => {
    if (roles) {
      const highestRole = Object.values(roles).reduce((currentHighestRole, role) =>
        !currentHighestRole || role.role.id < currentHighestRole.id
        ? role.role
        : currentHighestRole
      , null);
      return highestRole.attributes.friendly_name;
    }
    return this.context.intl.formatMessage(appMessages.entities.roles.defaultRole);
  }
  getHeaderAsideFields = (entity, roles, isManager) => ([
    {
      fields: isManager ? [
        {
          controlType: 'combo',
          fields: [
            {
              controlType: 'info',
              type: 'reference',
              value: entity.id,
            },
            {
              id: 'role',
              controlType: 'select',
              model: '.associatedRole',
              label: this.context.intl.formatMessage(appMessages.entities.roles.single),
              value: this.getHighestUserRoleId(entity.roles),
              options: this.getRoleOptions(roles),
            },
          ],
        },
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
      ]
      : [
        {
          controlType: 'info',
          type: 'referenceRole',
          fields: [
            {
              type: 'reference',
              value: entity.id,
            },
            {
              type: 'role',
              value: this.getHighestUserRoleLabel(entity.roles),
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
          id: 'email',
          controlType: 'email',
          model: '.attributes.email',
          label: this.context.intl.formatMessage(appMessages.attributes.email),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
      ],
    },
  ]);

  // getBodyAsideFields = (entity, isManager, taxonomies) => ([ // fieldGroups
  //   !isManager ? null : { // fieldGroup
  //     label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
  //     icon: 'categories',
  //     fields: renderTaxonomyControl(taxonomies),
  //   },
  // ]);

  getFields = (entity, roles, isManager) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity, roles, isManager),
    },
    body: {
      main: this.getBodyMainFields(),
      aside: null, // this.getBodyAsideFields(entity, isManager, taxonomies),
    },
  })

  render() {
    const { user, dataReady, viewDomain, taxonomies, roles, isManager } = this.props;
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
            icon="users"
            buttons={
              user && [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(this.props.params.id),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                  taxonomies,
                  roles,
                  user.roles
                ),
              }]
            }
          />
          {saveSending &&
            <p>Saving</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !user && !dataReady &&
            <Loading />
          }
          { !user && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {user && dataReady &&
            <EntityForm
              model="userEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomies,
                roles,
                user.roles
              )}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(user, roles, isManager)}
            />
          }
        </Content>
      </div>
    );
  }
}

UserEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  user: PropTypes.object,
  roles: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  params: PropTypes.object,
};

UserEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'users',
    'roles',
    'categories',
    'taxonomies',
    'user_categories',
  ] }),
  user: getUser(
    state,
    {
      id: props.params.id,
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
        {
          path: 'user_roles',
          key: 'user_id',
          as: 'roles',
          reverse: true,
          extend: {
            type: 'single',
            path: 'roles',
            key: 'role_id',
            as: 'role',
          },
        },
      ],
    },
  ),
  // all categories for all taggable taxonomies, listing connection if any
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_users: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        extend: {
          as: 'associated',
          path: 'user_categories',
          key: 'category_id',
          reverse: true,
          where: {
            user_id: props.params.id,
          },
        },
      },
    },
  ),
  roles: getEntities(
    state,
    {
      path: 'roles',
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('roles'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('user_categories'));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData, taxonomies, roleOptions, previousRoles) => {
      let saveData = formData.set('userCategories', taxonomies.reduce((updates, tax, taxId) => {
        const formCategoryIds = getCheckedValuesFromOptions(formData.getIn(['associatedTaxonomies', taxId]));

        // store associated cats as { [cat.id]: [association.id], ... }
        // then we can use keys for creating new associations and values for deleting
        const associatedCategories = tax.get('categories').reduce((catsAssociated, cat) => {
          if (cat.get('associated')) {
            return catsAssociated.set(cat.get('id'), cat.get('associated').keySeq().first());
          }
          return catsAssociated;
        }, Map());

        return Map({
          delete: updates.get('delete').concat(associatedCategories.reduce((associatedIds, associatedId, catId) =>
            !formCategoryIds.includes(catId)
              ? associatedIds.push(associatedId)
              : associatedIds
          , List())),
          create: updates.get('create').concat(formCategoryIds.reduce((payloads, catId) =>
            !associatedCategories.has(catId)
              ? payloads.push(Map({
                category_id: catId,
                user_id: formData.get('id'),
              }))
              : payloads
          , List())),
        });
      }, Map({ delete: List(), create: List() })));

      // roles
      // higher is actually lower
      const newHighestRole = formData.get('associatedRole');
      // store all higher roles
      const newRoleIds = parseInt(newHighestRole, 10) === 0
        ? []
        : Object.values(roleOptions).reduce((memo, role) => parseInt(newHighestRole, 10) <= parseInt(role.id, 10)
            ? memo.concat([role.id])
            : memo
          , []
        );
      saveData = saveData.set('userRoles', Map({
        delete: previousRoles && Object.values(previousRoles).reduce((memo, previousRole) =>
          newRoleIds.indexOf(previousRole.attributes.role_id.toString()) < 0
            ? memo.push(previousRole.id)
            : memo
          , List()),
        create: newRoleIds.reduce((memo, id) =>
          !previousRoles || map(map(previousRoles, 'attributes'), 'role_id').indexOf(parseInt(id, 10)) < 0
            ? memo.push(Map({ role_id: id, user_id: formData.get('id') }))
            : memo
        , List()),
      }));
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`/users/${reference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);

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

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getUser,
  getEntities,
  isReady,
  isUserManager,
} from 'containers/App/selectors';

import {
  taxonomyOptions,
  roleOptions,
  renderRoleControl,
  renderTaxonomyControl,
} from 'utils/forms';

import viewDomainSelect from './selectors';

import messages from './messages';
import { save } from './actions';

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
    const { taxonomies, roles, user } = props;

    return Map({
      id: user.id,
      attributes: fromJS(user.attributes),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRoles: roleOptions(roles),
    });
  }

  render() {
    const { user, dataReady, isManager, viewDomain } = this.props;
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
              onClick: () => this.props.handleSubmit(
                viewDomain.form.data,
                this.props.taxonomies,
                this.props.roles
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
          { !user && !dataReady &&
            <div>
              <FormattedMessage {...messages.loading} />
            </div>
          }
          { !user && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {user &&
            <EntityForm
              model="userEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                this.props.taxonomies,
                this.props.roles
              )}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: [
                    {
                      id: 'name',
                      controlType: 'name',
                      model: '.attributes.name',
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: isManager
                    ? [
                      renderRoleControl(this.props.roles),
                      {
                        id: 'no',
                        controlType: 'info',
                        displayValue: reference,
                      },
                      {
                        id: 'updated',
                        controlType: 'info',
                        displayValue: user.attributes.updated_at,
                      },
                      {
                        id: 'updated_by',
                        controlType: 'info',
                        displayValue: user.user && user.user.attributes.name,
                      },
                    ]
                  : [],
                },
                body: {
                  main: [
                    {
                      id: 'email',
                      controlType: 'email',
                      model: '.attributes.email',
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: isManager && renderTaxonomyControl(this.props.taxonomies),
                },
              }}
            />
          }
        </Page>
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
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
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
      extend: {
        as: 'associated',
        path: 'user_roles',
        key: 'role_id',
        reverse: true,
        where: {
          user_id: props.params.id,
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
      dispatch(loadEntitiesIfNeeded('roles'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('user_categories'));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData, taxonomies, roles) => {
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
      const formRoleIds = getCheckedValuesFromOptions(formData.get('associatedRoles'));
      // store associated recs as { [rec.id]: [association.id], ... }
      const associatedRoles = roles.reduce((rolesAssociated, entity) => {
        if (entity.get('associated')) {
          return rolesAssociated.set(entity.get('id'), entity.get('associated').keySeq().first());
        }
        return rolesAssociated;
      }, Map());

      saveData = saveData.set('userRoles', Map({
        delete: associatedRoles.reduce((associatedIds, associatedId, id) =>
          !formRoleIds.includes(id) ? associatedIds.push(associatedId) : associatedIds
        , List()),
        create: formRoleIds.reduce((payloads, id) =>
          !associatedRoles.has(id)
            ? payloads.push(Map({
              role_id: id,
              user_id: formData.get('id'),
            }))
            : payloads
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

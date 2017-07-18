/*
 *
 * UserEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { Map, List } from 'immutable';

import {
  taxonomyOptions,
  validateRequired,
  renderTaxonomyControl,
  getCategoryUpdatesFromFormData,
} from 'utils/forms';

import {
  getMetaField,
  getRoleField,
} from 'utils/fields';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import {
  selectReady,
  selectIsUserManager,
} from 'containers/App/selectors';

import { CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectRoles,
} from './selectors';

import { save } from './actions';
import messages from './messages';
import { DEPENDENCIES } from './constants';

export class UserEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.populateForm('userEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.populateForm('userEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, roles, viewEntity } = props;

    return Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes'),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRole: this.getHighestUserRoleId(roles),
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
    return roles.reduce((memo, role) =>
      memo.concat([
        {
          value: parseInt(role.get('id'), 10),
          label: role.getIn(['attributes', 'friendly_name']),
        },
      ])
    , roleOptions);
  }

  // only show the highest rated role (lower role ids means higher)
  getHighestUserRoleId = (roles) =>
    roles.reduce((currentHighestRoleId, role) =>
      role.get('associated') && role.get('id') < currentHighestRoleId
        ? role.get('id')
        : currentHighestRoleId
    , 99999);

  // only show the highest rated role (lower role ids means higher)
  getHighestUserRoleLabel = (roles) => {
    const highestRole = roles.reduce((currentHighestRole, role) =>
      role.get('associated') && (!currentHighestRole || role.get('id') < currentHighestRole.get('id'))
        ? role.get('id')
        : currentHighestRole
    , null);
    return highestRole
      ? highestRole.getIn(['attributes', 'friendly_name'])
      : this.context.intl.formatMessage(appMessages.entities.roles.defaultRole);
  }

  getHeaderAsideFields = (entity, roles, isManager) => ([
    {
      fields: isManager ? [
        {
          id: 'role',
          controlType: 'select',
          model: '.associatedRole',
          label: this.context.intl.formatMessage(appMessages.entities.roles.single),
          value: this.getHighestUserRoleId(roles),
          options: this.getRoleOptions(roles),
        },
        getMetaField(entity, appMessages),
      ]
      : [
        getRoleField(entity),
        getMetaField(entity, appMessages),
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

  getBodyAsideFields = (isManager, taxonomies) => ([ // fieldGroups
    !isManager ? null : { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  getFields = (entity, roles, isManager, taxonomies) => ({
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity, roles, isManager),
    },
    body: {
      main: this.getBodyMainFields(),
      aside: this.getBodyAsideFields(isManager, taxonomies),
    },
  })

  render() {
    const { viewEntity, dataReady, viewDomain, taxonomies, roles, isManager } = this.props;
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
              viewEntity && [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(this.props.params.id),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                  taxonomies,
                  roles,
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
          { !viewEntity && !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady &&
            <EntityForm
              model="userEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomies,
                roles,
              )}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(viewEntity, roles, isManager, taxonomies)}
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
  viewEntity: PropTypes.object,
  roles: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  params: PropTypes.object,
};

UserEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  roles: selectRoles(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData, taxonomies, roles) => {
      let saveData = formData
        .set(
          'userCategories',
          getCategoryUpdatesFromFormData({
            formData,
            taxonomies,
            createKey: 'user_id',
          })
        );

      // roles
      // higher is actually lower
      const newHighestRole = parseInt(formData.get('associatedRole'), 10);
      // store all higher roles
      const newRoleIds = newHighestRole === 0
        ? List()
        : roles.reduce((memo, role) =>
          newHighestRole <= parseInt(role.get('id'), 10)
            ? memo.push(role.get('id'))
            : memo
        , List());

      saveData = saveData.set('userRoles', Map({
        delete: roles.reduce((memo, role) =>
          role.get('associated') && newRoleIds.includes(role.get('id'))
            ? memo.push(role.getIn(['associated', 'id']))
            : memo
          , List()),
        create: newRoleIds.reduce((memo, id) =>
          roles.find((role) => role.get('id') === id && !role.get('associated'))
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

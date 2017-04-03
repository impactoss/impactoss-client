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
import { browserHistory } from 'react-router';
import { reduce } from 'lodash/collection';

import { fromJS } from 'immutable';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getUser,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import {
  pageSelector,
  formSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class UserEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.user && this.props.dataReady) {
      this.props.populateForm('userEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }

    if (nextProps.user && nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('userEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const data = {
      id: props.user.id,
      attributes: props.user.attributes,
    };

    const { roles } = this.props;

    data.associatedRoles = roles
      ? Object.values(roles).reduce((ids, entity) =>
          entity.associated ? ids.concat([entity.id]) : ids
        , [])
      : [];

    return data;
  }

  mapRoleOptions = (roles) => Object.values(roles).map((entity) => ({
    value: entity.id,
    label: entity.attributes.friendly_name,
  }));

  renderRoleControl = (roles) => roles ? ({
    id: 'roles',
    model: '.associatedRoles',
    label: 'Roles',
    controlType: 'multiselect',
    options: this.mapRoleOptions(roles),
  }) : [];


  render() {
    const { user, dataReady } = this.props;
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
                onClick: () => this.props.handleSubmit(this.props.form.data, this.props.roles),
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
              model="userEdit.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData, this.props.roles)}
              handleCancel={() => this.props.handleCancel(reference)}
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
                  aside: [
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
                  ],
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
                  aside: [
                    this.renderRoleControl(this.props.roles),
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

UserEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
  user: PropTypes.object,
  roles: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
};

UserEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  page: pageSelector(state),
  form: formSelector(state),
  dataReady: isReady(state, { path: [
    'users',
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
  roles: getEntities(
    state,
    {
      path: 'roles',
      out: 'js',
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
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData, roles) => {
      const saveData = formData.toJS();

      // roles
      const formRoleIds = saveData.associatedRoles;
      // store associated recs as { [rec.id]: [association.id], ... }
      const associatedRoles = Object.values(roles).reduce((rolesAssociated, role) => {
        const result = rolesAssociated;
        if (role.associated) {
          result[role.id] = Object.keys(role.associated)[0];
        }
        return result;
      }, {});

      saveData.userRoles = {
        delete: reduce(associatedRoles, (associatedIds, associatedId, id) =>
          formRoleIds.indexOf(id.toString()) === -1
            ? associatedIds.concat([associatedId])
            : associatedIds
        , []),
        create: reduce(formRoleIds, (payloads, id) =>
          Object.keys(associatedRoles).indexOf(id.toString()) === -1
            ? payloads.concat([{
              role_id: id,
              user_id: saveData.id,
            }])
            : payloads
        , []),
      };
      dispatch(save(saveData));
    },
    handleCancel: (reference) => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/users/${reference}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);

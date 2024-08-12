/*
 *
 * UserEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Map, List, fromJS } from 'immutable';

import {
  taxonomyOptions,
  renderTaxonomyControl,
  getCategoryUpdatesFromFormData,
  getTitleFormField,
  getEmailFormField,
  getHighestUserRoleId,
  getRoleFormField,
} from 'utils/formik';

import {
  getMetaField,
  getRoleField,
  getTitleField,
  getEmailField,
} from 'utils/fields';
import { canUserManageUsers, canUserSeeMeta } from 'utils/permissions';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import qe from 'utils/quasi-equals';

import {
  loadEntitiesIfNeeded,
  updatePath,
  submitInvalid,
  saveErrorDismiss,
  openNewEntityModal,
  redirectNotPermitted,
} from 'containers/App/actions';

import {
  selectReady,
  selectSessionUserHighestRoleId,
  selectReadyForAuthCheck,
  selectSessionUserId,
  selectCanUserAdministerCategories,
} from 'containers/App/selectors';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, ENABLE_AZURE } from 'themes/config';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import appMessages from 'containers/App/messages';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectRoles,
} from './selectors';

import { save } from './actions';
import messages from './messages';

import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class UserEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
    this.remoteSubmitForm = null;
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && nextProps.authReady && nextProps.viewEntity) {
      const canEdit = canUserManageUsers(nextProps.sessionUserHighestRoleId)
        || (nextProps.viewEntity.get('id') === nextProps.sessionUserId && !ENABLE_AZURE);
      if (!canEdit) {
        this.props.onRedirectNotPermitted();
      }
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getInitialFormData = ({ taxonomies, roles, viewEntity }) => 
    Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRole: getHighestUserRoleId(roles),
    });

  getHeaderMainFields = (entity, isManager, intl) => {
    if (!ENABLE_AZURE) {
      return ([{ // fieldGroup
        fields: [getTitleFormField(intl.formatMessage, 'title', 'name')],
      }]);
    }
    return ([{ // fieldGroup
      fields: [getTitleField(entity, isManager, 'name', appMessages.attributes.name)],
    }]);
  };

  getHeaderAsideFields = (entity, roles, userId, highestRole, intl) => {
    let fields = [];
    const canSeeRole = canUserManageUsers(highestRole)
      || qe(entity.get('id'), userId);
    if (!ENABLE_AZURE && canUserManageUsers(highestRole)) {
      fields = [
        getRoleFormField(intl.formatMessage, roles),
      ];
    } else if (canSeeRole) {
      fields = [
        getRoleField(entity),
      ];
    }
    if (canUserSeeMeta(highestRole)) {
      fields = [...fields, getMetaField(entity)];
    }

    return ([{ fields }]);
  };

  getBodyMainFields = (entity, intl) => {
    if (!ENABLE_AZURE) {
      return ([{
        fields: [getEmailFormField(intl.formatMessage)],
      }]);
    }
    return ([{
      fields: [getEmailField(entity)],
    }]);
  };

  getBodyAsideFields = (taxonomies, onCreateOption, canCreateCategories, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: renderTaxonomyControl({
          taxonomies,
          onCreateOption: canCreateCategories ? onCreateOption : null,
          contextIntl: intl,
        }),
      },
    ]);

  getEditableUserRoles = (roles, sessionUserHighestRoleId) => {
    if (roles) {
      const userHighestRoleId = getHighestUserRoleId(roles);
      // roles are editable by the session user (logged on user) if
      // unless the session user is an ADMIN
      // the session user can only assign roles "lower" (that is higher id) than his/her own role
      // and when the session user has a "higher" (lower id) role than the user profile being edited
      return roles
        .filter((role) => sessionUserHighestRoleId === USER_ROLES.ADMIN.value
          || (sessionUserHighestRoleId < userHighestRoleId && sessionUserHighestRoleId < parseInt(role.get('id'), 10)));
    }
    return Map();
  };

  render() {
    const {
      sessionUserId,
      viewEntity,
      dataReady,
      viewDomain,
      taxonomies,
      roles,
      sessionUserHighestRoleId,
      onCreateOption,
      canUserAdministerCategories,
      intl,
    } = this.props;
    const isManager = sessionUserHighestRoleId <= USER_ROLES.MANAGER.value;
    const isAdmin = sessionUserHighestRoleId <= USER_ROLES.ADMIN.value;

    const reference = this.props.params.id;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();

    const editableRoles = this.getEditableUserRoles(roles, sessionUserHighestRoleId);

    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="users"
            buttons={
              viewEntity && [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(this.props.params.id),
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: (e) => {
                  if (this.remoteSubmitForm) {
                    this.remoteSubmitForm(e);
                  }
                },
              }]
            }
          />
          {!submitValid
            && (
              <Messages
                type="error"
                messageKey="submitInvalid"
                onDismiss={this.props.onErrorDismiss}
              />
            )
          }
          {saveError
            && (
              <Messages
                type="error"
                messages={saveError.messages}
                onDismiss={this.props.onServerErrorDismiss}
              />
            )
          }
          {(saveSending || !dataReady)
            && <Loading />
          }
          {!viewEntity && dataReady && !saveError
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {viewEntity && dataReady
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  taxonomies,
                  roles,
                  viewEntity,
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={() => this.props.handleCancel(reference)}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity, isManager, intl),
                    aside: this.getHeaderAsideFields(
                      viewEntity,
                      editableRoles,
                      sessionUserId,
                      sessionUserHighestRoleId,
                      intl,
                    ),
                  },
                  body: {
                    main: this.getBodyMainFields(viewEntity, intl),
                    aside: isAdmin && this.getBodyAsideFields(
                      taxonomies,
                      onCreateOption,
                      canUserAdministerCategories,
                      intl,
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

UserEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  roles: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  sessionUserHighestRoleId: PropTypes.number,
  params: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  onRedirectNotPermitted: PropTypes.func,
  // authReady: PropTypes.bool,
  sessionUserId: PropTypes.string, // used in nextProps
  canUserAdministerCategories: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  sessionUserHighestRoleId: selectSessionUserHighestRoleId(state),
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  roles: selectRoles(state, props.params.id),
  sessionUserId: selectSessionUserId(state),
  canUserAdministerCategories: selectCanUserAdministerCategories(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onRedirectNotPermitted: () => {
      dispatch(redirectNotPermitted());
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmit: (formValues, taxonomies, roles, viewEntity) => {
      const formData = fromJS(formValues)
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
      const newRoleIds = newHighestRole === USER_ROLES.DEFAULT.value
        ? List()
        : roles.reduce((memo, role) => newHighestRole <= parseInt(role.get('id'), 10)
          ? memo.push(role.get('id'))
          : memo,
        List());

      saveData = saveData.set('userRoles', Map({
        delete: roles.reduce((memo, role) => role.get('associated')
            && !newRoleIds.includes(role.get('id'))
            && !newRoleIds.includes(parseInt(role.get('id'), 10))
          ? memo.push(role.getIn(['associated', 'id']))
          : memo,
        List()),
        create: newRoleIds.reduce((memo, id) => roles.find((role) => role.get('id') === id && !role.get('associated'))
          ? memo.push(Map({ role_id: id, user_id: formData.get('id') }))
          : memo,
        List()),
      }));

      // check if attributes have changed
      if (saveData.get('attributes').equals(viewEntity.get('attributes'))) {
        saveData = saveData.set('skipAttributes', true);
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`${ROUTES.USERS}/${reference}`, { replace: true }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserEdit));

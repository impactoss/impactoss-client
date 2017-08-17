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
  renderTaxonomyControl,
  getCategoryUpdatesFromFormData,
  getTitleFormField,
  getEmailField,
  getHighestUserRoleId,
  getRoleFormField,
} from 'utils/forms';

import {
  getMetaField,
  getRoleField,
} from 'utils/fields';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectIsUserManager,
} from 'containers/App/selectors';

import { CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import ErrorMessages from 'components/ErrorMessages';
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
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class UserEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('userEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('userEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, roles, viewEntity } = props;

    return Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRole: getHighestUserRoleId(roles),
    });
  }

  getHeaderMainFields = () => ([{ // fieldGroup
    fields: [getTitleFormField(this.context.intl.formatMessage, appMessages, 'title', 'name')],
  }]);

  getHeaderAsideFields = (entity, roles, isManager) => ([
    {
      fields: isManager ? [
        getRoleFormField(this.context.intl.formatMessage, appMessages, roles),
        getMetaField(entity, appMessages),
      ]
      : [
        getRoleField(entity, this.context.intl.formatMessage, appMessages),
        getMetaField(entity, appMessages),
      ],
    },
  ]);

  getBodyMainFields = () => ([{
    fields: [getEmailField(this.context.intl.formatMessage, appMessages)],
  }]);

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  render() {
    const { viewEntity, dataReady, viewDomain, taxonomies, roles, isManager } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, submitValid } = viewDomain.page;

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
                onClick: () => this.props.handleSubmitRemote('userEdit.form.data'),
              }]
            }
          />
          {!submitValid &&
            <ErrorMessages
              error={{ messages: [this.context.intl.formatMessage(appMessages.forms.multipleErrors)] }}
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <ErrorMessages
              error={saveError}
              onDismiss={this.props.onServerErrorDismiss}
            />
          }
          {(saveSending || !dataReady) &&
            <Loading />
          }
          {!viewEntity && dataReady && !saveError &&
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
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(viewEntity, roles, isManager),
                },
                body: {
                  main: this.getBodyMainFields(),
                  aside: isManager && this.getBodyAsideFields(taxonomies),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

UserEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
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
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
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
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
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
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
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
          role.get('associated') && newRoleIds.includes(parseInt(role.get('id'), 10))
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

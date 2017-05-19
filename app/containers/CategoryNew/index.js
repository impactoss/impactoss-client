/*
 *
 * CategoryNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { List } from 'immutable';

import {
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


export class CategoryNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
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
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.short_title),
          model: '.attributes.short_title',
          label: this.context.intl.formatMessage(appMessages.attributes.short_title),
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
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
          label: this.context.intl.formatMessage(appMessages.attributes.description),
        },
      ],
    },
  ]);

  getBodyAsideFields = (users, isAdmin, taxonomy) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [{
        id: 'url',
        controlType: 'url',
        model: '.attributes.url',
        placeholder: this.context.intl.formatMessage(appMessages.placeholders.url),
        label: this.context.intl.formatMessage(appMessages.attributes.url),
      }],
    });
    if (isAdmin && !!taxonomy.attributes.has_manager) {
      fields.push({
        fields: [
          renderUserControl(
            users,
            this.context.intl.formatMessage(appMessages.attributes.manager_id.categories)
          ),
        ],
      });
    }
    return fields;
  }

  getFields = (users, isAdmin, taxonomy) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
    },
    body: {
      main: this.getBodyMainFields(),
      aside: this.getBodyAsideFields(users, isAdmin, taxonomy),
    },
  })

  render() {
    const { taxonomy, dataReady, isAdmin, viewDomain, users } = this.props;
    const { saveSending, saveError } = viewDomain.page;
    const taxonomyReference = this.props.params.id;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (taxonomy && taxonomy.attributes) {
      pageTitle = `${pageTitle} (${taxonomy.attributes.title})`;
    }

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="actions"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(taxonomyReference),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                  taxonomyReference
                ),
              }] : null
            }
          />
          { !dataReady &&
            <Loading />
          }
          {saveSending &&
            <p>Saving Category</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          {dataReady &&
            <EntityForm
              model="categoryNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomyReference
              )}
              handleCancel={() => this.props.handleCancel(taxonomyReference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(users, isAdmin, taxonomy)}
            />
          }
        </Content>
      </div>
    );
  }
}

CategoryNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  viewDomain: PropTypes.object,
  taxonomy: PropTypes.object,
  params: PropTypes.object,
  users: PropTypes.object,
};

CategoryNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAdmin: isUserAdmin(state),
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'taxonomies',
    'users',
    'user_roles',
  ] }),
  taxonomy: getEntity(
    state,
    {
      id: props.params.id,
      path: 'taxonomies',
      out: 'js',
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
          role_id: USER_ROLES.MANAGER,
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData, taxonomyReference) => {
      let saveData = formData.setIn(['attributes', 'taxonomy_id'], taxonomyReference);
      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (taxonomyReference) => {
      dispatch(updatePath(`/categories/${taxonomyReference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryNew);

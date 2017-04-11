/*
 *
 * CategoryNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import { Map, List } from 'immutable';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { USER_ROLES } from 'containers/App/constants';

import {
  getEntity,
  getEntities,
  isReady,
  isUserAdmin,
} from 'containers/App/selectors';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import categoryNewSelector from './selectors';
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
  }
  mapUserOptions = (entities) => entities.toList().map((entity) => Map({
    value: entity.get('id'),
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
    const { taxonomy, dataReady, isAdmin } = this.props;
    const { saveSending, saveError } = this.props.categoryNew.page;
    const taxonomyReference = this.props.params.id;
    const required = (val) => val && val.length;


    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);

    if (taxonomy && taxonomy.attributes) {
      pageTitle = `${pageTitle} (${taxonomy.attributes.title})`;
    }

    const mainAsideFields = [];
    if (dataReady && isAdmin && !!taxonomy.attributes.has_manager && this.props.users) {
      mainAsideFields.push(this.renderUserControl(this.props.users));
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
        { !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        {dataReady &&
          <Page
            title={pageTitle}
            actions={
              [
                {
                  type: 'simple',
                  title: 'Cancel',
                  onClick: () => this.props.handleCancel(taxonomyReference),
                },
                {
                  type: 'primary',
                  title: 'Save',
                  onClick: () => this.props.handleSubmit(
                    this.props.categoryNew.form.data,
                    taxonomyReference
                  ),
                },
              ]
            }
          >
            {saveSending &&
              <p>Saving Category</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }

            <EntityForm
              model="categoryNew.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomyReference
              )}
              handleCancel={() => this.props.handleCancel(taxonomyReference)}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.attributes.title',
                      placeholder: this.context.intl.formatMessage(messages.fields.title.placeholder),
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: [],
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

CategoryNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  categoryNew: PropTypes.object,
  taxonomy: PropTypes.object,
  params: PropTypes.object,
  users: PropTypes.object,
};

CategoryNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAdmin: isUserAdmin,
  categoryNew: categoryNewSelector(state),
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
    handleSubmit: (formData, taxonomyReference) => {
      let saveData = formData.setIn(['attributes', 'taxonomy_id'], taxonomyReference);
      // TODO: remove once have singleselect instead of multiselect
      if (List.isList(saveData.get('associatedUser'))) {
        saveData = saveData.setIn(['attributes', 'manager_id'], saveData.get('associatedUser').first());
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (taxonomyReference) => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/categories/${taxonomyReference}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryNew);

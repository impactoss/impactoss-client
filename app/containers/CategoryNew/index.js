/*
 *
 * CategoryNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { List } from 'immutable';

import {
  renderUserControl,
  getTitleFormField,
  getReferenceFormField,
  getShortTitleFormField,
  getMarkdownField,
  getFormField,
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
  selectReady,
  selectIsUserAdmin,
  selectEntity,
} from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectUsers,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';


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
        getReferenceFormField(this.context.intl.formatMessage, appMessages),
        getTitleFormField(this.context.intl.formatMessage, appMessages),
        getShortTitleFormField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);

  getBodyMainFields = () => ([{
    fields: [getMarkdownField(this.context.intl.formatMessage, appMessages)],
  }]);

  getBodyAsideFields = (users, isAdmin, taxonomy) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [getFormField(this.context.intl.formatMessage, appMessages, 'url', 'url')],
    });
    if (isAdmin && !!taxonomy.getIn(['attributes', 'has_manager'])) {
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

  render() {
    const { taxonomy, dataReady, isAdmin, viewDomain, users } = this.props;
    const { saveSending, saveError } = viewDomain.page;
    const taxonomyReference = this.props.params.id;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (taxonomy && taxonomy.get('attributes')) {
      pageTitle = `${pageTitle} (${taxonomy.getIn(['attributes', 'title'])})`;
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
            icon="measures"
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
            <Loading />
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
              fields={{ // isManager, taxonomies,
                header: {
                  main: this.getHeaderMainFields(),
                },
                body: {
                  main: this.getBodyMainFields(),
                  aside: this.getBodyAsideFields(users, isAdmin, taxonomy),
                },
              }}
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
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAdmin: selectIsUserAdmin(state),
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomy: selectEntity(state, { path: 'taxonomies', id: props.params.id }),
  users: selectUsers(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
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

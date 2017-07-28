/*
 *
 * PageEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map } from 'immutable';

import {
  getTitleFormField,
  getMenuTitleFormField,
  getMarkdownField,
  getStatusField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  deleteEntity,
  } from 'containers/App/actions';

import { selectReady, selectIsUserAdmin } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectViewEntity,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class PageEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.populateForm('pageEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('pageEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity } = props;
    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
    })
    : Map();
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getTitleFormField(this.context.intl.formatMessage, appMessages),
        getMenuTitleFormField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(this.context.intl.formatMessage, appMessages, entity),
        getMetaField(entity, appMessages),
      ],
    },
  ]);

  getBodyMainFields = () => ([{
    fields: [getMarkdownField(this.context.intl.formatMessage, appMessages, 'content')],
  }]);

  render() {
    const { viewEntity, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, deleteSending, deleteError } = viewDomain.page;

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
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data),
              }] : null
            }
          />
          {(saveSending || deleteSending || !dataReady) &&
            <Loading />
          }
          {deleteError &&
            <p>{deleteError}</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          {!viewEntity && dataReady && !saveError && !deleteSending &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady && !deleteSending &&
            <EntityForm
              model="pageEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              handleDelete={this.props.isUserAdmin ? this.props.handleDelete : null}
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(viewEntity),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

PageEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  viewEntity: PropTypes.object,
};

PageEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.ADMIN));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`/pages/${props.params.id}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: 'pages',
        id: props.params.id,
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEdit);

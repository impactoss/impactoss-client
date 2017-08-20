/*
 *
 * ReportEdit
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
  getDueDateOptionsField,
  getDocumentStatusField,
  getStatusField,
  getMarkdownField,
  getUploadField,
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
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import { selectReady, selectIsUserAdmin } from 'containers/App/selectors';

import ErrorMessages from 'components/ErrorMessages';
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

export class ReportEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('reportEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }

    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.redirectIfNotPermitted();
      this.props.initialiseForm('reportEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity } = props;
    let attributes = viewEntity.get('attributes');
    if (attributes.get('due_date_id')) {
      attributes = attributes.set('due_date_id', attributes.get('due_date_id').toString());
    }
    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: attributes.mergeWith(
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

  getBodyMainFields = (entity) => ([
    {
      fields: [
        getMarkdownField(this.context.intl.formatMessage, appMessages),
        getUploadField(this.context.intl.formatMessage, appMessages),
        getDocumentStatusField(this.context.intl.formatMessage, appMessages, entity),
      ],
    },
  ]);

  getBodyAsideFields = (entity) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.single),
      icon: 'calendar',
      fields: entity.get('indicator') && entity.getIn(['indicator', 'dates']) &&
        [getDueDateOptionsField(
          this.context.intl.formatMessage,
          appMessages,
          this.context.intl.formatDate,
          entity.getIn(['indicator', 'dates']),
          entity.getIn(['attributes', 'due_date_id'])
            ? entity.getIn(['attributes', 'due_date_id']).toString()
            : '0',
        )],
    },
  ]);

  render() {
    const { viewEntity, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, deleteSending, deleteError, submitValid } = viewDomain.page;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (viewEntity && dataReady) {
      pageTitle = `${pageTitle} for indicator ${viewEntity.getIn(['attributes', 'indicator_id'])}`;
    }
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
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="reports"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('reportEdit.form.data'),
              }] : null
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
          {deleteError &&
            <ErrorMessages error={deleteError} />
          }
          {(saveSending || deleteSending || !dataReady) &&
            <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady && !deleteSending &&
            <EntityForm
              model="reportEdit.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(formData, viewEntity.getIn(['attributes', 'due_date_id']))}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              handleDelete={() => this.props.isUserAdmin
                ? this.props.handleDelete(viewEntity.getIn(['attributes', 'indicator_id']))
                : null
              }
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(viewEntity),
                  aside: this.getBodyAsideFields(viewEntity),
                },
              }}
            />
          }
          { (saveSending || deleteSending) &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

ReportEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
};

ReportEdit.contextTypes = {
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
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
      dispatch(loadEntitiesIfNeeded('indicators'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.CONTRIBUTOR));
    },
    initialiseForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
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
    handleSubmit: (formData, previousDateAssigned) => {
      let saveData = formData;

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      saveData = saveData.setIn(
        ['attributes', 'due_date_id'],
        dateAssigned === '0' || dateAssigned === 0
        ? null
        : parseInt(dateAssigned, 10)
      );

      dispatch(save(
        saveData.toJS(),
        previousDateAssigned && previousDateAssigned !== dateAssigned
          ? previousDateAssigned
          : null
      ));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`/reports/${reference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: (indicatorId) => {
      dispatch(deleteEntity({
        path: 'progress_reports',
        id: props.params.id,
        redirect: `indicators/${indicatorId}`,
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportEdit);

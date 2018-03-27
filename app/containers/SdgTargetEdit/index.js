/*
 *
 * SdgTargetEdit
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
  taxonomyOptions,
  entityOptions,
  renderMeasureControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
  getReferenceFormField,
  getMarkdownField,
  getStatusField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  deleteEntity,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectIsUserAdmin,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectIndicators,
  selectMeasures,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class SdgTargetEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('sdgtargetEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('sdgtargetEdit.form.data', this.getInitialFormData(nextProps));
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.ScrollContainer) {
      scrollToTop(this.ScrollContainer);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, indicators, viewEntity, measures } = props;

    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedIndicators: entityOptions(indicators, true),
      associatedMeasures: entityOptions(measures, true),
    })
    : Map();
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage, appMessages, true), // required
        getTitleFormField(this.context.intl.formatMessage, appMessages, 'titleText'),
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

  getBodyMainFields = (connectedTaxonomies, indicators, measures, onCreateOption) => ([
    {
      fields: [getMarkdownField(this.context.intl.formatMessage, appMessages)],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderMeasureControl(measures, connectedTaxonomies, onCreateOption, this.context.intl),
        renderIndicatorControl(indicators, onCreateOption),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies, onCreateOption) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies, onCreateOption, this.context.intl),
    },
  ]);

  render() {
    const { viewEntity, dataReady, viewDomain, connectedTaxonomies, indicators, taxonomies, measures, onCreateOption } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, deleteSending, deleteError, submitValid } = viewDomain.page;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content innerRef={(node) => { this.ScrollContainer = node; }} >
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="sdgtargets"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('sdgtargetEdit.form.data'),
              }] : null
            }
          />
          {!submitValid &&
            <Messages
              type="error"
              messageKey="submitInvalid"
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <Messages
              type="error"
              messages={saveError.messages}
              onDismiss={this.props.onServerErrorDismiss}
            />
          }
          {deleteError &&
            <Messages type="error" messages={deleteError} />
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
              model="sdgtargetEdit.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomies,
                indicators,
                measures
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              handleDelete={this.props.isUserAdmin ? this.props.handleDelete : null}
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(connectedTaxonomies, indicators, measures, onCreateOption),
                  aside: this.getBodyAsideFields(taxonomies, onCreateOption),
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

SdgTargetEdit.propTypes = {
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
  authReady: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  indicators: PropTypes.object,
  measures: PropTypes.object,
  onCreateOption: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
};

SdgTargetEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
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
    handleSubmit: (formData, taxonomies, indicators, measures) => {
      const saveData = formData
        .set(
          'sdgtargetCategories',
          getCategoryUpdatesFromFormData({
            formData,
            taxonomies,
            createKey: 'sdgtarget_id',
          })
        )
        .set(
          'sdgtargetMeasures',
          getConnectionUpdatesFromFormData({
            formData,
            connections: measures,
            connectionAttribute: 'associatedMeasures',
            createConnectionKey: 'measure_id',
            createKey: 'sdgtarget_id',
          })
        )
        .set(
          'sdgtargetIndicators',
          getConnectionUpdatesFromFormData({
            formData,
            connections: indicators,
            connectionAttribute: 'associatedIndicators',
            createConnectionKey: 'indicator_id',
            createKey: 'sdgtarget_id',
          })
        );

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`${PATHS.SDG_TARGETS}/${props.params.id}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: 'sdgtargets',
        id: props.params.id,
      }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetEdit);

/*
 *
 * ActionEdit
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
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
  getFields,
} from 'utils/forms';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, MEASURE_SHAPE } from 'themes/config';

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

import { getInitialFormData } from 'utils/entities';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectRecommendations,
  selectIndicators,
  selectSdgTargets,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      scrollContainer: null,
    };
  }

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('measureEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('measureEdit.form.data', this.getInitialFormData(nextProps));
    }
    //
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.state.scrollContainer) {
      scrollToTop(this.state.scrollContainer);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity, taxonomies, recommendations, indicators, sdgtargets } = props;

    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        getInitialFormData(MEASURE_SHAPE).get('attributes')
      ),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRecommendations: entityOptions(recommendations, true),
      associatedIndicators: entityOptions(indicators, true),
      associatedSdgTargets: entityOptions(sdgtargets, true),
    })
    : Map();
  }

  render() {
    const { viewEntity, dataReady, viewDomain, taxonomies, connectedTaxonomies, recommendations, indicators, sdgtargets, onCreateOption } = this.props;
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
        <Content
          innerRef={(node) => {
            if (!this.state.scrollContainer) {
              this.setState({ scrollContainer: node });
            }
          }}
        >
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="measures"
            buttons={
              viewEntity && dataReady
              ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('measureEdit.form.data'),
              }]
              : null
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
              model="measureEdit.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomies,
                recommendations,
                indicators,
                sdgtargets
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              handleDelete={this.props.isUserAdmin ? this.props.handleDelete : null}
              fields={getFields({
                entity: viewEntity,
                associations: {
                  taxonomies,
                  connectedTaxonomies,
                  recommendations,
                  indicators,
                  sdgtargets,
                },
                onCreateOption,
                shape: MEASURE_SHAPE,
                contextIntl: this.context.intl,
              })}
              scrollContainer={this.state.scrollContainer}
            />
          }
          {(saveSending || deleteSending) &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActionEdit.propTypes = {
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
  connectedTaxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
};

ActionEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  sdgtargets: selectSdgTargets(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  recommendations: selectRecommendations(state, props.params.id),
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
    handleSubmit: (formData, taxonomies, recommendations, indicators, sdgtargets) => {
      const saveData = formData
        .set(
          'measureCategories',
          getCategoryUpdatesFromFormData({
            formData,
            taxonomies,
            createKey: 'measure_id',
          })
        )
        .set(
          'recommendationMeasures',
          getConnectionUpdatesFromFormData({
            formData,
            connections: recommendations,
            connectionAttribute: 'associatedRecommendations',
            createConnectionKey: 'recommendation_id',
            createKey: 'measure_id',
          })
        )
        .set(
          'sdgtargetMeasures',
          getConnectionUpdatesFromFormData({
            formData,
            connections: sdgtargets,
            connectionAttribute: 'associatedSdgTargets',
            createConnectionKey: 'sdgtarget_id',
            createKey: 'measure_id',
          })
        )
        .set(
          'measureIndicators',
          getConnectionUpdatesFromFormData({
            formData,
            connections: indicators,
            connectionAttribute: 'associatedIndicators',
            createConnectionKey: 'indicator_id',
            createKey: 'measure_id',
          })
        );

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`/actions/${props.params.id}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: 'measures',
        id: props.params.id,
        redirect: 'actions',
      }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

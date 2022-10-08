/*
 *
 * RecommendationEdit
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
  getAcceptedField,
  getStatusField,
  getMarkdownField,
} from 'utils/forms';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getMetaField } from 'utils/fields';
import { attributesEqual } from 'utils/entities';

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
  selectFrameworks,
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
  selectMeasures,
  selectIndicators,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class RecommendationEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      scrollContainer: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('recommendationEdit.form.data', this.getInitialFormData());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.initialiseForm('recommendationEdit.form.data', this.getInitialFormData(nextProps));
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.state.scrollContainer) {
      scrollToTop(this.state.scrollContainer);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, measures, indicators, viewEntity } = props;
    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedMeasures: entityOptions(measures, true),
      associatedIndicators: entityOptions(indicators, true),
    })
    : Map();
  };

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage, true), // required
        getTitleFormField(this.context.intl.formatMessage, 'titleText'),
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        getStatusField(this.context.intl.formatMessage, entity),
        getMetaField(entity),
      ],
    },
  ]);
  getBodyMainFields = (
    connectedTaxonomies,
    entity,
    measures,
    indicators,
    onCreateOption,
    hasResponse,
  ) => {
    const groups = [];
    groups.push({
      fields: [
        getMarkdownField(this.context.intl.formatMessage, 'description', 'fullRecommendation', 'fullRecommendation', 'fullRecommendation'),
        hasResponse && getAcceptedField(this.context.intl.formatMessage, entity),
        hasResponse && getMarkdownField(this.context.intl.formatMessage, 'response'),
      ],
    });
    if (measures) {
      groups.push({
        label: this.context.intl.formatMessage(appMessages.nav.measuresSuper),
        icon: 'measures',
        fields: [
          renderMeasureControl(measures, connectedTaxonomies, onCreateOption, this.context.intl),
        ],
      });
    }
    if (indicators) {
      groups.push({
        label: this.context.intl.formatMessage(appMessages.nav.indicatorsSuper),
        icon: 'indicators',
        fields: [
          renderIndicatorControl(indicators, onCreateOption),
        ],
      });
    }
    return groups;
  }

  getBodyAsideFields = (taxonomies, onCreateOption) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies, onCreateOption, this.context.intl),
    },
  ]);

  render() {
    const {
      viewEntity,
      dataReady,
      viewDomain,
      connectedTaxonomies,
      measures,
      taxonomies,
      indicators,
      onCreateOption,
      frameworks,
    } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, deleteSending, deleteError, submitValid } = viewDomain.page;
    const frameworkId = viewEntity && viewEntity.getIn(['attributes', 'framework_id']);
    const type = this.context.intl.formatMessage(
      appMessages.entities[frameworkId ? `recommendations_${frameworkId}` : 'recommendations'].single
    );

    const currentFramework = dataReady && frameworks.find((fw) => attributesEqual(fw.get('id'), frameworkId));
    const hasResponse = dataReady && currentFramework.getIn(['attributes', 'has_response']);
    const hasMeasures = dataReady && currentFramework.getIn(['attributes', 'has_measures']);
    const hasIndicators = dataReady && currentFramework.getIn(['attributes', 'has_indicators']);
    const fwTaxonomies = taxonomies && taxonomies.filter((tax) =>
      tax.get('frameworkIds').find((id) => attributesEqual(id, frameworkId)) ||
      attributesEqual(frameworkId, tax.getIn(['attributes', 'framework_id']))
    );

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle, { type })}: ${reference}`}
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
            title={this.context.intl.formatMessage(messages.pageTitle, { type })}
            type={CONTENT_SINGLE}
            icon={frameworkId ? `recommendations_${frameworkId}` : 'recommendations'}
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('recommendationEdit.form.data'),
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
              model="recommendationEdit.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                fwTaxonomies,
                measures,
                indicators,
                currentFramework,
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
                  main: this.getBodyMainFields(
                    connectedTaxonomies,
                    viewEntity,
                    hasMeasures && measures,
                    hasIndicators && indicators,
                    onCreateOption,
                    hasResponse,
                  ),
                  aside: this.getBodyAsideFields(fwTaxonomies, onCreateOption),
                },
              }}
              scrollContainer={this.state.scrollContainer}
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

RecommendationEdit.propTypes = {
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
  measures: PropTypes.object,
  indicators: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  connectedTaxonomies: PropTypes.object,
  frameworks: PropTypes.object,
};

RecommendationEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};
const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  frameworks: selectFrameworks(state),
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
    handleSubmit: (formData, taxonomies, measures, indicators, currentFramework) => {
      let saveData = formData
        .set(
          'recommendationCategories',
          getCategoryUpdatesFromFormData({
            formData,
            taxonomies,
            createKey: 'recommendation_id',
          })
        )
        .set(
          'recommendationMeasures',
          getConnectionUpdatesFromFormData({
            formData,
            connections: measures,
            connectionAttribute: 'associatedMeasures',
            createConnectionKey: 'measure_id',
            createKey: 'recommendation_id',
          })
        )
        .set(
          'recommendationIndicators',
          getConnectionUpdatesFromFormData({
            formData,
            connections: indicators,
            connectionAttribute: 'associatedIndicators',
            createConnectionKey: 'indicator_id',
            createKey: 'recommendation_id',
          })
        );
      // cleanup attributes for framework
      if (!currentFramework.getIn(['attributes', 'has_response'])) {
        saveData = saveData
          .setIn(['attributes', 'accepted'], '')
          .setIn(['attributes', 'response'], '');
      } else if (saveData.getIn(['attributes', 'accepted']) === '') {
        saveData = saveData.setIn(['attributes', 'accepted'], 'true');
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`${PATHS.RECOMMENDATIONS}/${props.params.id}`, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: 'recommendations',
        id: props.params.id,
      }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationEdit);

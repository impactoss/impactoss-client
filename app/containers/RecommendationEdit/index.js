/*
 *
 * RecommendationEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { Map, fromJS } from 'immutable';

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
  getSupportField,
  getStatusField,
  getArchiveField,
  getMarkdownFormField,
} from 'utils/forms';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import { canUserDeleteEntities } from 'utils/permissions';
import { getMetaField } from 'utils/fields';
import { qe } from 'utils/quasi-equals';
import { lowerCase } from 'utils/string';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  deleteEntity,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectSessionUserHighestRoleId,
  selectFrameworks,
  selectRecommendationReferences,
  selectCanUserAdministerCategories,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';
import NotFoundEntity from 'containers/NotFoundEntity';

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
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getInitialFormData = ({ taxonomies, measures, indicators, viewEntity }) =>
    viewEntity
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

  getHeaderMainFields = (existingReferences, intl) => 
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getReferenceFormField({
            formatMessage: intl.formatMessage,
            required: true,
            prohibitedValues: existingReferences,
          }),
          getTitleFormField(intl.formatMessage, 'titleText'),
        ],
      },
    ]);

  getHeaderAsideFields = (entity, intl) =>
    ([
      {
        fields: [
          getStatusField(intl.formatMessage),
          getArchiveField(intl.formatMessage),
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
    intl
  ) => {
    const groups = [];
    groups.push({
      fields: [
        getMarkdownFormField({
          formatMessage: intl.formatMessage,
          attribute: 'description',
          label: 'fullRecommendation',
          placeholder: 'fullRecommendation',
          hint: 'fullRecommendation',
        }),
        hasResponse && getSupportField(intl.formatMessage, entity),
        getMarkdownFormField({
          formatMessage: intl.formatMessage,
          attribute: 'response',
        }),
      ],
    });
    if (measures) {
      groups.push({
        label: intl.formatMessage(appMessages.nav.measuresSuper),
        icon: 'measures',
        fields: [
          renderMeasureControl(measures, connectedTaxonomies, onCreateOption, intl),
        ],
      });
    }
    if (indicators) {
      groups.push({
        label: intl.formatMessage(appMessages.nav.indicatorsSuper),
        icon: 'indicators',
        fields: [
          renderIndicatorControl(indicators, onCreateOption, intl),
        ],
      });
    }
    return groups;
  };

  getBodyAsideFields = (taxonomies, onCreateOption, canCreateCategories, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.taxonomies.plural),
        icon: 'categories',
        fields: renderTaxonomyControl({
          taxonomies,
          onCreateOption: canCreateCategories ? onCreateOption : null,
          contextIntl: intl,
        }),
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
      existingReferences,
      canUserAdministerCategories,
      intl,
    } = this.props;
    const reference = this.props.params.id;
    const {
      saveSending, saveError, deleteSending, deleteError, submitValid,
    } = viewDomain.get('page').toJS();
    const frameworkId = viewEntity && viewEntity.getIn(['attributes', 'framework_id']);
    const type = intl.formatMessage(
      appMessages.entities[frameworkId ? `recommendations_${frameworkId}` : 'recommendations'].single
    );

    const currentFramework = dataReady && frameworks.find((fw) => qe(fw.get('id'), frameworkId));
    const hasResponse = dataReady && currentFramework && currentFramework.getIn(['attributes', 'has_response']);
    const hasMeasures = dataReady && currentFramework && currentFramework.getIn(['attributes', 'has_measures']);
    const hasIndicators = dataReady && currentFramework && currentFramework.getIn(['attributes', 'has_indicators']);
    const fwTaxonomies = taxonomies && taxonomies.filter((tax) => tax.get('frameworkIds').find((id) => qe(id, frameworkId))
      || qe(frameworkId, tax.getIn(['attributes', 'framework_id'])));

    // console.log('render', this.scrollContainer)
    // console.log('render', this.scrollContainer.current)
    // console.log('render', this.scrollContainer.current && this.scrollContainer.current.getBoundingClientRect)


    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle, { type })}: ${reference}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle, { type })}
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
                onClick: (e) => {
                  if (this.remoteSubmitForm) {
                    this.remoteSubmitForm(e);
                  }
                },
              }] : null
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
          {deleteError
            && <Messages type="error" messages={deleteError.messages} />
          }
          {(saveSending || deleteSending || !dataReady)
            && <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending && (
            <NotFoundEntity
              id={this.props.params.id}
              type={lowerCase(type)}
            />
          )}
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  fwTaxonomies,
                  measures,
                  indicators,
                  currentFramework,
                  viewEntity,
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                handleDelete={canUserDeleteEntities(this.props.highestRole) ? this.props.handleDelete : null}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(
                      existingReferences
                        ? existingReferences.filter((r) => r !== viewEntity.getIn(['attributes', 'reference']))
                        : null,
                      intl
                    ),
                    aside: this.getHeaderAsideFields(viewEntity, intl),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      connectedTaxonomies,
                      viewEntity,
                      hasMeasures && measures,
                      hasIndicators && indicators,
                      onCreateOption,
                      hasResponse,
                      intl
                    ),
                    aside: this.getBodyAsideFields(
                      fwTaxonomies,
                      onCreateOption,
                      canUserAdministerCategories,
                      intl
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { (saveSending || deleteSending)
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

RecommendationEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  highestRole: PropTypes.number,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  measures: PropTypes.object,
  indicators: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  connectedTaxonomies: PropTypes.object,
  frameworks: PropTypes.object,
  existingReferences: PropTypes.array,
  canUserAdministerCategories: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  highestRole: selectSessionUserHighestRoleId(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  indicators: selectIndicators(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  frameworks: selectFrameworks(state),
  existingReferences: selectRecommendationReferences(state),
  canUserAdministerCategories: selectCanUserAdministerCategories(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
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
    handleSubmit: (
      formValues,
      taxonomies,
      measures,
      indicators,
      currentFramework,
      viewEntity,
    ) => {
      const formData = fromJS(formValues)
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
      if (!currentFramework || !currentFramework.getIn(['attributes', 'has_response'])) {
        saveData = saveData
          .setIn(['attributes', 'support_level'], '')
          .setIn(['attributes', 'response'], '');
      }
      if (saveData.getIn(['attributes', 'support_level']) === 'null') {
        saveData = saveData.setIn(['attributes', 'support_level'], null);
      }
      // check if attributes have changed
      if (saveData.get('attributes').equals(viewEntity.get('attributes'))) {
        saveData = saveData.set('skipAttributes', true);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`${ROUTES.RECOMMENDATIONS}/${props.params.id}`, { replace: true }));
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationEdit));

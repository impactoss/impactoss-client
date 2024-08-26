/*
 *
 * ActionEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Map, fromJS } from 'immutable';

import {
  taxonomyOptions,
  entityOptions,
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
  getStatusField,
  getMarkdownFormField,
  renderIndicatorControl,
  renderRecommendationsByFwControl,
  getDateField,
  getTextareaField,
  renderTaxonomyControl,
  getReferenceFormField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import { canUserDeleteEntities } from 'utils/permissions';

import { CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

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
  selectIsUserAdmin,
  selectSessionUserHighestRoleId,
  selectCanUserAdministerCategories,
  selectMeasureReferences,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import appMessages from 'containers/App/messages';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectRecommendationsByFw,
  selectIndicators,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
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

  getInitialFormData = ({ viewEntity, taxonomies, recommendationsByFw, indicators }) => {
    let attributes = viewEntity.get('attributes');
    if (!attributes.get('reference') || attributes.get('reference') === '') {
      attributes = attributes.set('reference', viewEntity.get('id'));
    }

    return viewEntity
      ? Map({
        id: viewEntity.get('id'),
        attributes: attributes.mergeWith(
          (oldVal, newVal) => oldVal === null ? newVal : oldVal,
          FORM_INITIAL.get('attributes')
        ),
        associatedTaxonomies: taxonomyOptions(taxonomies),
        associatedRecommendationsByFw: recommendationsByFw
          ? recommendationsByFw.map((recs) => entityOptions(recs, true))
          : Map(),
        associatedIndicators: entityOptions(indicators, true),
      })
      : Map();
  };

  getHeaderMainFields = (existingReferences, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getReferenceFormField({
            formatMessage: intl.formatMessage,
            required: true,
            prohibitedValues: existingReferences,
          }),
          getTitleFormField(intl.formatMessage),
        ],
      },
    ]);

  getHeaderAsideFields = (entity, intl) =>
    ([
      {
        fields: [
          getStatusField(intl.formatMessage),
          getMetaField(entity),
        ],
      },
    ]);

  getBodyMainFields = (
    connectedTaxonomies,
    indicators,
    recommendationsByFw,
    onCreateOption,
    intl,
  ) => {
    const groups = [];
    groups.push(
      {
        fields: [
          getMarkdownFormField({
            formatMessage: intl.formatMessage,
            attribute: 'description',
            label: 'fullMeasure',
          }),
          getMarkdownFormField({
            formatMessage: intl.formatMessage,
            attribute: 'outcome',
            label: 'comment',
          }),
          // getMarkdownFormField(intl.formatMessage, 'indicator_summary'),
        ],
      },
    );
    if (indicators) {
      groups.push(
        {
          label: intl.formatMessage(appMessages.nav.indicatorsSuper),
          icon: 'indicators',
          fields: [
            renderIndicatorControl(indicators, onCreateOption, intl),
          ],
        },
      );
    }
    if (recommendationsByFw) {
      const recConnections = renderRecommendationsByFwControl(
        recommendationsByFw,
        connectedTaxonomies,
        onCreateOption,
        intl,
      );
      if (recConnections) {
        groups.push(
          {
            label: intl.formatMessage(appMessages.nav.recommendationsSuper),
            icon: 'recommendations',
            fields: recConnections,
          },
        );
      }
    }
    return groups;
  };

  getBodyAsideFields = (taxonomies, onCreateOption, canCreateCategories, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getDateField({
            formatMessage: intl.formatMessage,
            attribute: 'target_date',
          }),
          getTextareaField(
            intl.formatMessage,
            'target_date_comment',
          ),
        ],
      },
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
      taxonomies,
      connectedTaxonomies,
      recommendationsByFw,
      indicators,
      onCreateOption,
      existingReferences,
      canUserAdministerCategories,
      intl,
    } = this.props;
    const reference = this.props.params.id;
    const {
      saveSending, saveError, deleteSending, deleteError, submitValid,
    } = viewDomain.get('page').toJS();

    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
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
                  onClick: (e) => {
                    if (this.remoteSubmitForm) {
                      this.remoteSubmitForm(e);
                    }
                  },
                }]
                : null
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
          {!viewEntity && dataReady && !saveError && !deleteSending
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                bindHandleSubmit={this.bindHandleSubmit}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  taxonomies,
                  recommendationsByFw,
                  indicators,
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
                      indicators,
                      recommendationsByFw,
                      onCreateOption,
                      intl,
                    ),
                    aside: this.getBodyAsideFields(
                      taxonomies,
                      onCreateOption,
                      canUserAdministerCategories,
                      intl,
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          {(saveSending || deleteSending)
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActionEdit.propTypes = {
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
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  highestRole: PropTypes.number,
  connectedTaxonomies: PropTypes.object,
  recommendationsByFw: PropTypes.object,
  canUserAdministerCategories: PropTypes.bool,
  indicators: PropTypes.object,
  onCreateOption: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  existingReferences: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  highestRole: selectSessionUserHighestRoleId(state),
  canUserAdministerCategories: selectCanUserAdministerCategories(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  indicators: selectIndicators(state, props.params.id),
  recommendationsByFw: selectRecommendationsByFw(state, props.params.id),
  existingReferences: selectMeasureReferences(state),
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
    handleSubmit: (formValues, taxonomies, recommendationsByFw, indicators, viewEntity) => {
      const formData = fromJS(formValues);
      let saveData = formData
        .set(
          'measureCategories',
          getCategoryUpdatesFromFormData({
            formData,
            taxonomies,
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
      saveData = saveData.set(
        'recommendationMeasures',
        recommendationsByFw
          .map((recs, fwid) => getConnectionUpdatesFromFormData({
            formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
            connections: recs,
            connectionAttribute: ['associatedRecommendationsByFw', fwid.toString()],
            createConnectionKey: 'recommendation_id',
            createKey: 'measure_id',
          }))
          .reduce(
            (memo, deleteCreateLists) => {
              const deletes = memo.get('delete').concat(deleteCreateLists.get('delete'));
              const creates = memo.get('create').concat(deleteCreateLists.get('create'));
              return memo
                .set('delete', deletes)
                .set('create', creates);
            },
            fromJS({
              delete: [],
              create: [],
            }),
          )
      );
      // default to database id
      const formRef = formData.getIn(['attributes', 'reference']) || '';
      if (formRef.trim() === '') {
        saveData = saveData.setIn(['attributes', 'reference'], formData.get('id'));
      }
      // check if attributes have changed
      if (saveData.get('attributes').equals(viewEntity.get('attributes'))) {
        saveData = saveData.set('skipAttributes', true);
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`/actions/${props.params.id}`, { replace: true }));
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionEdit));

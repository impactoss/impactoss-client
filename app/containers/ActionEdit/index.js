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
  renderRecommendationControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  renderSdgTargetControl,
  validateDateFormat,
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { selectReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectViewEntity,
  selectTaxonomies,
  selectRecommendations,
  selectIndicators,
  selectSdgTargets,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.populateForm('measureEdit.form.data', this.getInitialFormData());
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
      this.props.populateForm('measureEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity, taxonomies, recommendations, indicators, sdgtargets } = props;

    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes'),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRecommendations: entityOptions(recommendations, true),
      associatedIndicators: entityOptions(indicators, true),
      associatedSdgTargets: entityOptions(sdgtargets, true),
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
        {
          id: 'status',
          controlType: 'select',
          model: '.attributes.draft',
          label: this.context.intl.formatMessage(appMessages.attributes.draft),
          value: entity.getIn(['attributes', 'draft']),
          options: PUBLISH_STATUSES,
        },
        getMetaField(entity, appMessages),
      ],
    },
  ]);

  getBodyMainFields = (recommendations, indicators, sdgtargets) => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
          label: this.context.intl.formatMessage(appMessages.attributes.description),
        },
        {
          id: 'outcome',
          controlType: 'markdown',
          model: '.attributes.outcome',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.outcome),
          label: this.context.intl.formatMessage(appMessages.attributes.outcome),
        },
        {
          id: 'indicator_summary',
          controlType: 'markdown',
          model: '.attributes.indicator_summary',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.indicator_summary),
          label: this.context.intl.formatMessage(appMessages.attributes.indicator_summary),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderRecommendationControl(recommendations),
        renderSdgTargetControl(sdgtargets),
        renderIndicatorControl(indicators),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    { // fieldGroup
      fields: [{
        id: 'target_date',
        controlType: 'date',
        model: '.attributes.target_date',
        label: this.context.intl.formatMessage(appMessages.attributes.target_date),
        placeholder: 'YYYY-MM-DD',
        validators: {
          date: validateDateFormat,
        },
        errorMessages: {
          date: this.context.intl.formatMessage(appMessages.forms.dateFormatError),
        },
      },
      {
        id: 'target_date_comment',
        controlType: 'textarea',
        model: '.attributes.target_date_comment',
        label: this.context.intl.formatMessage(appMessages.attributes.target_date_comment),
        placeholder: this.context.intl.formatMessage(appMessages.placeholders.target_date_comment),
      }],
    },
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  getFields = (entity, taxonomies, recommendations, indicators, sdgtargets) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(recommendations, indicators, sdgtargets),
      aside: this.getBodyAsideFields(taxonomies),
    },
  })

  render() {
    const { viewEntity, dataReady, viewDomain, taxonomies, recommendations, indicators, sdgtargets } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;

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
            icon="measures"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                  taxonomies,
                  recommendations,
                  indicators,
                  sdgtargets
                ),
              }] : null
            }
          />
          {saveSending &&
            <p>Saving</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !viewEntity && !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady &&
            <EntityForm
              model="measureEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomies,
                recommendations,
                indicators,
                sdgtargets
              )}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(viewEntity, taxonomies, recommendations, indicators, sdgtargets)}
            />
          }
        </Content>
      </div>
    );
  }
}

ActionEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
};

ActionEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  taxonomies: selectTaxonomies(state, props.params.id),
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
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
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
      dispatch(updatePath(`/actions/${props.params.id}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

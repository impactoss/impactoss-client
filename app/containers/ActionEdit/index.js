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

import { Map, fromJS } from 'immutable';

import {
  taxonomyOptions,
  entityOptions,
  renderRecommendationControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  renderSdgTargetControl,
  validateRequired,
  validateDateFormat,
} from 'utils/forms';

import {
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
} from 'utils/entities';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';
import messages from './messages';
import { save } from './actions';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.action) {
      this.props.populateForm('actionEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.action) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('actionEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, recommendations, indicators, action, sdgtargets } = props;

    return action
    ? Map({
      id: action.id,
      attributes: fromJS(action.attributes),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRecommendations: entityOptions(recommendations, true),
      associatedIndicators: entityOptions(indicators, true),
      associatedSdgTargets: entityOptions(sdgtargets, true),
    })
    : Map();
  }

  getHeaderMainFields = (entity) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          controlType: 'info',
          type: 'reference',
          value: entity.id,
          label: this.context.intl.formatMessage(appMessages.attributes.id),
        },
        {
          id: 'title',
          controlType: 'title',
          model: '.attributes.title',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.title),
          label: this.context.intl.formatMessage(appMessages.attributes.title),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
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
          value: entity.attributes.draft,
          options: PUBLISH_STATUSES,
        },
        {
          controlType: 'info',
          type: 'meta',
          fields: [
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
              value: this.context.intl.formatDate(new Date(entity.attributes.updated_at)),
            },
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
              value: entity.user && entity.user.attributes.name,
            },
          ],
        },
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

  getBodyAsideFields = (entity, taxonomies) => ([ // fieldGroups
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
      main: this.getHeaderMainFields(entity),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(recommendations, indicators, sdgtargets),
      aside: this.getBodyAsideFields(entity, taxonomies),
    },
  })

  render() {
    const { action, dataReady, viewDomain, recommendations, indicators, taxonomies, sdgtargets } = this.props;
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
            icon="actions"
            buttons={
              action && dataReady ? [{
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
          { !action && !dataReady &&
            <Loading />
          }
          { !action && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {action && dataReady &&
            <EntityForm
              model="actionEdit.form.data"
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
              fields={this.getFields(action, taxonomies, recommendations, indicators, sdgtargets)}
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
  action: PropTypes.object,
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
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'categories',
    'taxonomies',
    'recommendations',
    'recommendation_measures',
    'measure_categories',
    'indicators',
    'measure_indicators',
    'sdgtargets',
  ] }),
  action: getEntity(
    state,
    {
      id: props.params.id,
      path: 'measures',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
  // all categories for all taggable taxonomies, listing connection if any
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_measures: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        extend: {
          as: 'associated',
          path: 'measure_categories',
          key: 'category_id',
          reverse: true,
          where: {
            measure_id: props.params.id,
          },
        },
      },
    },
  ),
  // all recommendations, listing connection if any
  recommendations: getEntities(
    state,
    {
      path: 'recommendations',
      extend: {
        as: 'associated',
        path: 'recommendation_measures',
        key: 'recommendation_id',
        reverse: true,
        where: {
          measure_id: props.params.id,
        },
      },
    },
  ),
  // all recommendations, listing connection if any
  sdgtargets: getEntities(
    state,
    {
      path: 'sdgtargets',
      extend: {
        as: 'associated',
        path: 'sdgtarget_measures',
        key: 'sdgtarget_id',
        reverse: true,
        where: {
          measure_id: props.params.id,
        },
      },
    },
  ),
  indicators: getEntities(
    state,
    {
      path: 'indicators',
      extend: {
        as: 'associated',
        path: 'measure_indicators',
        key: 'indicator_id',
        reverse: true,
        where: {
          measure_id: props.params.id,
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
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

/*
 *
 * RecommendationEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, fromJS } from 'immutable';

import {
  taxonomyOptions,
  entityOptions,
  renderActionControl,
  renderTaxonomyControl,
  validateRequired,
} from 'utils/forms';

import {
  getCategoryUpdatesFromFormData,
  getConnectionUpdatesFromFormData,
} from 'utils/entities';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE, ACCEPTED_STATUSES } from 'containers/App/constants';
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

export class RecommendationEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.recommendation) {
      this.props.populateForm('recommendationEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.recommendation) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('recommendationEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, actions, recommendation } = props;
    return recommendation
    ? Map({
      id: recommendation.id,
      attributes: fromJS(recommendation.attributes),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedActions: entityOptions(actions, true),
    })
    : Map();
  };

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'reference',
          controlType: 'short',
          model: '.attributes.reference',
          label: this.context.intl.formatMessage(appMessages.attributes.reference),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
        {
          id: 'title',
          controlType: 'titleText',
          model: '.attributes.title',
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
  getBodyMainFields = (actions) => ([
    {
      fields: [
        {
          id: 'accepted',
          controlType: 'select',
          model: '.attributes.accepted',
          label: this.context.intl.formatMessage(appMessages.attributes.accepted),
          options: ACCEPTED_STATUSES,
        },
        {
          id: 'response',
          controlType: 'markdown',
          model: '.attributes.response',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.response),
          label: this.context.intl.formatMessage(appMessages.attributes.response),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderActionControl(actions),
      ],
    },
  ]);

  getBodyAsideFields = (entity, taxonomies) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  getFields = (entity, taxonomies, actions) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(actions),
      aside: this.getBodyAsideFields(entity, taxonomies),
    },
  })
  render() {
    const { recommendation, dataReady, viewDomain, actions, taxonomies } = this.props;
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
            icon="recommendations"
            buttons={
              recommendation && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                  taxonomies,
                  actions,
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
          { !recommendation && !dataReady &&
            <Loading />
          }
          { !recommendation && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {recommendation && dataReady &&
            <EntityForm
              model="recommendationEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomies,
                actions
              )}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(recommendation, taxonomies, actions)}
            />
          }
        </Content>
      </div>
    );
  }
}

RecommendationEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  recommendation: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  actions: PropTypes.object,
};

RecommendationEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'recommendations',
    'users',
    'categories',
    'taxonomies',
    'measures',
    'recommendation_measures',
    'recommendation_categories',
  ] }),
  recommendation: getEntity(
    state,
    {
      id: props.params.id,
      path: 'recommendations',
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
        tags_recommendations: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        extend: {
          as: 'associated',
          path: 'recommendation_categories',
          key: 'category_id',
          reverse: true,
          where: {
            recommendation_id: props.params.id,
          },
        },
      },
    },
  ),
  // // all actions, listing connection if any
  actions: getEntities(
    state, {
      path: 'measures',
      extend: {
        as: 'associated',
        path: 'recommendation_measures',
        key: 'measure_id',
        reverse: true,
        where: {
          recommendation_id: props.params.id,
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
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData, taxonomies, actions) => {
      const saveData = formData
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
            connections: actions,
            connectionAttribute: 'associatedActions',
            createConnectionKey: 'measure_id',
            createKey: 'recommendation_id',
          })
        );

      dispatch(save(saveData.toJS()));
      // dispatch(save(formData, props.params.id));
    },
    handleCancel: () => {
      dispatch(updatePath(`/recommendations/${props.params.id}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationEdit);

/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List, fromJS } from 'immutable';

import {
  taxonomyOptions,
  entityOptions,
  renderRecommendationControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  validateRequired,
  validateDateFormat,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

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
    const { taxonomies, recommendations, indicators, action } = props;

    return action
    ? Map({
      id: action.id,
      attributes: fromJS(action.attributes),
      associatedTaxonomies: taxonomyOptions(taxonomies),
      associatedRecommendations: entityOptions(recommendations, true),
      associatedIndicators: entityOptions(indicators, true),
    })
    : Map();
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'title',
          controlType: 'title',
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
          controlType: 'combo',
          fields: [
            {
              controlType: 'info',
              type: 'reference',
              value: entity.id,
            },
            {
              id: 'status',
              controlType: 'select',
              model: '.attributes.draft',
              label: this.context.intl.formatMessage(appMessages.attributes.draft),
              value: entity.attributes.draft,
              options: PUBLISH_STATUSES,
            },
          ],
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

  getBodyMainFields = (recommendations, indicators) => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          label: this.context.intl.formatMessage(appMessages.attributes.description),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderRecommendationControl(recommendations),
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
      }],
    },
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  getFields = (entity, taxonomies, recommendations, indicators) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(recommendations, indicators),
      aside: this.getBodyAsideFields(entity, taxonomies),
    },
  })

  render() {
    const { action, dataReady, viewDomain, recommendations, indicators, taxonomies } = this.props;
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
                  indicators
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
                indicators
              )}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(action, taxonomies, recommendations, indicators)}
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
};

ActionEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
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
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },

    handleSubmit: (formData, taxonomies, recommendations, indicators) => {
      let saveData = formData.set('measureCategories', taxonomies.reduce((updates, tax, taxId) => {
        const formCategoryIds = getCheckedValuesFromOptions(formData.getIn(['associatedTaxonomies', taxId]));

        // store associated cats as { [cat.id]: [association.id], ... }
        // then we can use keys for creating new associations and values for deleting
        const associatedCategories = tax.get('categories').reduce((catsAssociated, cat) => {
          if (cat.get('associated')) {
            return catsAssociated.set(cat.get('id'), cat.get('associated').keySeq().first());
          }
          return catsAssociated;
        }, Map());

        return Map({
          delete: updates.get('delete').concat(associatedCategories.reduce((associatedIds, associatedId, catId) =>
            !formCategoryIds.includes(catId)
              ? associatedIds.push(associatedId)
              : associatedIds
          , List())),
          create: updates.get('create').concat(formCategoryIds.reduce((payloads, catId) =>
            !associatedCategories.has(catId)
              ? payloads.push(Map({
                category_id: catId,
                measure_id: formData.get('id'),
              }))
              : payloads
          , List())),
        });
      }, Map({ delete: List(), create: List() })));

      // recommendations
      const formRecommendationIds = getCheckedValuesFromOptions(formData.get('associatedRecommendations'));
      // store associated recs as { [rec.id]: [association.id], ... }
      const associatedRecommendations = recommendations.reduce((recsAssociated, rec) => {
        if (rec.get('associated')) {
          return recsAssociated.set(rec.get('id'), rec.get('associated').keySeq().first());
        }
        return recsAssociated;
      }, Map());

      saveData = saveData.set('recommendationMeasures', Map({
        delete: associatedRecommendations.reduce((associatedIds, associatedId, id) =>
          !formRecommendationIds.includes(id)
            ? associatedIds.push(associatedId)
            : associatedIds
        , List()),
        create: formRecommendationIds.reduce((payloads, id) =>
          !associatedRecommendations.has(id)
            ? payloads.push(Map({
              recommendation_id: id,
              measure_id: formData.get('id'),
            }))
            : payloads
        , List()),
      }));

      // indicators
      const formIndicatorIds = getCheckedValuesFromOptions(formData.get('associatedIndicators'));
      // store associated recs as { [rec.id]: [association.id], ... }
      const associatedIndicators = indicators.reduce((indicatorsAssociated, indicator) => {
        if (indicator.get('associated')) {
          return indicatorsAssociated.set(indicator.get('id'), indicator.get('associated').keySeq().first());
        }
        return indicatorsAssociated;
      }, Map());

      saveData = saveData.set('measureIndicators', Map({
        delete: associatedIndicators.reduce((associatedIds, associatedId, id) =>
          !formIndicatorIds.includes(id)
            ? associatedIds.push(associatedId)
            : associatedIds
        , List()),
        create: formIndicatorIds.reduce((payloads, id) =>
          !associatedIndicators.has(id)
            ? payloads.push(Map({
              indicator_id: id,
              measure_id: formData.get('id'),
            }))
            : payloads
        , List()),
      }));

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

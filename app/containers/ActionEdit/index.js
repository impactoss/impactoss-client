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
import { browserHistory } from 'react-router';

import { Map, List, fromJS } from 'immutable';

import { getCheckedValuesFromOptions } from 'components/MultiSelect';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import {
  pageSelector,
  formSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady) {
      this.props.populateForm('actionEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('actionEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { taxonomies, recommendations, indicators } = props;

    return Map({
      id: props.action.id,
      attributes: fromJS(props.action.attributes),
      associatedTaxonomies: taxonomies
      ? taxonomies.reduce((values, tax) =>
          values.set(
            tax.get('id'),
            tax.get('categories').reduce((option, entity) => option.push(Map({
              checked: !!entity.get('associated'),
              value: entity.get('id'),
            })), List()))
        , Map())
      : Map(),
      associatedRecommendations: recommendations
      ? recommendations.reduce((option, entity) => option.push(Map({
        checked: !!entity.get('associated'),
        value: entity.get('id'),
      })), List())
      : List(),
      associatedIndicators: indicators
        ? indicators.reduce((option, entity) => option.push(Map({
          checked: !!entity.get('associated'),
          value: entity.get('id'),
        })), List())
        : List(),
    });
  }

  mapCategoryOptions = (entities) => entities.toList().map((entity) => Map({
    value: Map({ value: entity.get('id') }),
    label: entity.getIn(['attributes', 'title']),
  }));

  mapRecommendationOptions = (entities) => entities.toList().map((entity) => Map({
    value: Map({ value: entity.get('id') }),
    label: entity.getIn(['attributes', 'title']),
  }));

  mapIndicatorOptions = (entities) => entities.toList().map((entity) => Map({
    value: Map({ value: entity.get('id') }),
    label: entity.getIn(['attributes', 'title']),
  }));

  // TODO this should be shared functionality
  renderTaxonomyControl = (taxonomies) => taxonomies.reduce((controls, tax) => controls.concat({
    id: tax.get('id'),
    model: `.associatedTaxonomies.${tax.get('id')}`,
    label: tax.getIn(['attributes', 'title']),
    controlType: 'multiselect',
    options: tax.get('categories') ? this.mapCategoryOptions(tax.get('categories')) : List(),
  }), [])

  // TODO this should be shared functionality
  renderRecommendationControl = (recommendations) => ({
    id: 'recommendations',
    model: '.associatedRecommendations',
    label: 'Recommendations',
    controlType: 'multiselect',
    options: this.mapRecommendationOptions(recommendations),
  });

  // TODO this should be shared functionality
  renderIndicatorControl = (indicators) => ({
    id: 'indicators',
    model: '.associatedIndicators',
    label: 'Indicators',
    controlType: 'multiselect',
    options: this.mapIndicatorOptions(indicators),
  });


  render() {
    const { action, dataReady } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = this.props.page;
    const required = (val) => val && val.length;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !action && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !action && dataReady && !saveError &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {action &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'primary',
                title: 'Save',
                onClick: () => this.props.handleSubmit(
                  this.props.form.data,
                  this.props.taxonomies,
                  this.props.recommendations,
                  this.props.indicators
                ),
              },
            ]}
          >
            {saveSending &&
              <p>Saving</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }
            <EntityForm
              model="actionEdit.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                this.props.taxonomies,
                this.props.recommendations,
                this.props.indicators
              )}
              handleCancel={this.props.handleCancel}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.attributes.title',
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: [
                    {
                      id: 'no',
                      controlType: 'info',
                      displayValue: reference,
                    },
                    {
                      id: 'status',
                      controlType: 'select',
                      model: '.attributes.draft',
                      value: action.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: action.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: action.user && action.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.attributes.description',
                    },
                    this.props.recommendations ? this.renderRecommendationControl(this.props.recommendations) : null,
                    this.props.indicators ? this.renderIndicatorControl(this.props.indicators) : null,
                  ],
                  aside: this.props.taxonomies ? this.renderTaxonomyControl(this.props.taxonomies) : null,
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

ActionEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
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
  page: pageSelector(state),
  form: formSelector(state),
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
        delete: associatedRecommendations.reduce((associatedIds, associatedId, recId) =>
          !formRecommendationIds.includes(recId)
            ? associatedIds.push(associatedId)
            : associatedIds
        , List()),
        create: formRecommendationIds.reduce((payloads, recId) =>
          !associatedRecommendations.has(recId)
            ? payloads.push(Map({
              recommendation_id: recId,
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
        delete: associatedIndicators.reduce((associatedIds, associatedId, recId) =>
          !formIndicatorIds.includes(recId)
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
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/actions/${props.params.id}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

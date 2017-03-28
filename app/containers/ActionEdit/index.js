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
import { reduce } from 'lodash/collection';

import { fromJS } from 'immutable';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/EntityForm';

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
    if (this.props.action && this.props.dataReady) {
      this.props.populateForm('actionEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props)
    // repopulate if new data becomes ready
    if (nextProps.action && nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('actionEdit.form.data', this.getInitialFormData(nextProps));
    }
    // reload entities if invalidated
    if (this.props.action && !nextProps.action && !nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const data = {
      id: props.action.id,
      attributes: props.action.attributes,
    };

    const { taxonomies, recommendations } = this.props;
    // TODO this functionality should be shared
      // Reducer - starts with {}, iterate taxonomies, and store associated ids as { [tax.id]: [associated,category,ids], ... }
    data.associatedTaxonomies = taxonomies
      ? Object.values(taxonomies).reduce((values, tax) => {
        const result = values;
        result[tax.id] = Object.values(tax.categories).reduce((ids, cat) =>
          cat.associated ? ids.concat([cat.id]) : ids
        , []);
        return result;
      }, {})
      : {};

    // TODO this functionality should be shared
      // Reducer - starts with {}, iterate taxonomies, and store associated ids as { [tax.id]: [associated,category,ids], ... }
    data.associatedRecommendations = recommendations
      ? Object.values(recommendations).reduce((ids, rec) =>
          rec.associated ? ids.concat([rec.id]) : ids
        , [])
      : [];

    return data;
  }

  mapCategoryOptions = (categories) => Object.values(categories).map((cat) => ({
    value: cat.id,
    label: cat.attributes.title,
  }));

  mapRecommendationOptions = (recommendations) => Object.values(recommendations).map((rec) => ({
    value: rec.id,
    label: rec.attributes.title,
  }));


  // TODO this should be shared functionality
  renderTaxonomyControl = (taxonomies) => taxonomies ? Object.values(taxonomies).map((tax) => ({
    id: tax.id,
    model: `.associatedTaxonomies.${tax.id}`,
    label: tax.attributes.title,
    controlType: 'multiselect',
    options: tax.categories ? this.mapCategoryOptions(tax.categories) : [],
  })) : [];

  // TODO this should be shared functionality
  renderRecommendationControl = (recommendations) => recommendations ? ({
    id: 'recommendations',
    model: '.associatedRecommendations',
    label: 'Recommendations',
    controlType: 'multiselect',
    options: this.mapRecommendationOptions(recommendations),
  }) : [];


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
                  this.props.recommendations
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
                this.props.recommendations
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
                    this.renderRecommendationControl(this.props.recommendations),
                  ],
                  aside: this.renderTaxonomyControl(this.props.taxonomies),
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
      out: 'js',
    },
  ),
  // all recommendations, listing connection if any
  recommendations: getEntities(
    state, {
      path: 'recommendations',
      out: 'js',
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
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData, taxonomies, recommendations) => {
      // TODO maybe this function should be updated to work with Immutable objects, instead of converting
      // const prevTaxonomies = prevFormData.associatedTaxonomies || {};
      const saveData = formData.toJS();

      // measureCategories
      saveData.measureCategories = reduce(taxonomies, (updates, tax, taxId) => {
        const formCategoryIds = saveData.associatedTaxonomies[taxId]; // the list of categories checked in form
        // store associated cats as { [cat.id]: [association.id], ... }
        // then we can use keys for creating new associations and values for deleting
        const associatedCategories = Object.values(tax.categories).reduce((catsAssociated, cat) => {
          const result = catsAssociated;
          if (cat.associated) {
            result[cat.id] = Object.keys(cat.associated)[0];
          }
          return result;
        }, {});

        return {
          delete: updates.delete.concat(reduce(associatedCategories, (associatedIds, associatedId, catId) =>
            formCategoryIds.indexOf(catId.toString()) === -1
              ? associatedIds.concat([associatedId])
              : associatedIds
          , [])),
          create: updates.create.concat(reduce(formCategoryIds, (payloads, catId) =>
            Object.keys(associatedCategories).indexOf(catId.toString()) === -1
              ? payloads.concat([{
                category_id: catId,
                measure_id: saveData.id,
              }])
              : payloads
          , [])),
        };
      }, { delete: [], create: [] });

      // recommendations
      const formRecommendationIds = saveData.associatedRecommendations;
      // store associated recs as { [rec.id]: [association.id], ... }
      const associatedRecommendations = Object.values(recommendations).reduce((recsAssociated, rec) => {
        const result = recsAssociated;
        if (rec.associated) {
          result[rec.id] = Object.keys(rec.associated)[0];
        }
        return result;
      }, {});

      saveData.recommendationMeasures = {
        delete: reduce(associatedRecommendations, (associatedIds, associatedId, recId) =>
          formRecommendationIds.indexOf(recId.toString()) === -1
            ? associatedIds.concat([associatedId])
            : associatedIds
        , []),
        create: reduce(formRecommendationIds, (payloads, recId) =>
          Object.keys(associatedRecommendations).indexOf(recId.toString()) === -1
            ? payloads.concat([{
              recommendation_id: recId,
              measure_id: saveData.id,
            }])
            : payloads
        , []),
      };

      dispatch(save(saveData));
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

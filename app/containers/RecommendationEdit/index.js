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

export class RecommendationEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.recommendation && this.props.dataReady) {
      this.props.populateForm('recommendationEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props)
    // repopulate if new data becomes ready
    if (nextProps.recommendation && nextProps.dataReady && !this.props.dataReady) {
      this.props.populateForm('recommendationEdit.form.data', this.getInitialFormData(nextProps));
    }
    // reload entities if invalidated
    if (this.props.recommendation && !nextProps.recommendation && !nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const data = {
      id: props.recommendation.id,
      attributes: props.recommendation.attributes,
    };

    const { taxonomies, actions } = this.props;

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
    data.associatedActions = actions
      ? Object.values(actions).reduce((ids, action) =>
          action.associated ? ids.concat([action.id]) : ids
        , [])
      : [];

    return data;
  }

  mapCategoryOptions = (categories) => Object.values(categories).map((cat) => ({
    value: cat.id,
    label: cat.attributes.title,
  }));

  mapActionOptions = (actions) => Object.values(actions).map((action) => ({
    value: action.id,
    label: action.attributes.title,
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
  renderActionControl = (actions) => actions ? ({
    id: 'actions',
    model: '.associatedActions',
    label: 'Actions',
    controlType: 'multiselect',
    options: this.mapActionOptions(actions),
  }) : [];


  render() {
    const { recommendation, dataReady } = this.props;
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
        { !recommendation && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !recommendation && dataReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {recommendation &&
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
                  this.props.actions
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
              model="recommendationEdit.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                this.props.taxonomies,
                this.props.actions
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
                      id: 'number',
                      controlType: 'input',
                      model: '.attributes.number',
                    },
                    {
                      id: 'status',
                      controlType: 'select',
                      model: '.attributes.draft',
                      value: recommendation.attributes.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: recommendation.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: recommendation.user && recommendation.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    this.renderActionControl(this.props.actions),
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

RecommendationEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
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
  page: pageSelector(state),
  form: formSelector(state),
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
      out: 'js',
    },
  ),
  // // all actions, listing connection if any
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
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
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData, taxonomies, actions) => {
      // TODO maybe this function should be updated to work with Immutable objects, instead of converting
      // const prevTaxonomies = prevFormData.associatedTaxonomies || {};
      const saveData = formData.toJS();

      // recommendationCategories
      saveData.recommendationCategories = reduce(taxonomies, (updates, tax, taxId) => {
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
                recommendation_id: saveData.id,
              }])
              : payloads
          , [])),
        };
      }, { delete: [], create: [] });

      // recommendations
      const formActionIds = saveData.associatedActions;
      // store associated Actions as { [action.id]: [association.id], ... }
      const associatedActions = Object.values(actions).reduce((actionsAssociated, action) => {
        const result = actionsAssociated;
        if (action.associated) {
          result[action.id] = Object.keys(action.associated)[0];
        }
        return result;
      }, {});

      saveData.recommendationMeasures = {
        delete: reduce(associatedActions, (associatedIds, associatedId, actionId) =>
          formActionIds.indexOf(actionId.toString()) === -1
            ? associatedIds.concat([associatedId])
            : associatedIds
        , []),
        create: reduce(formActionIds, (payloads, actionId) =>
          Object.keys(associatedActions).indexOf(actionId.toString()) === -1
            ? payloads.concat([{
              measure_id: actionId,
              recommendation_id: saveData.id,
            }])
            : payloads
        , []),
      };

      dispatch(save(saveData));
      // dispatch(save(formData, props.params.id));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/recommendations/${props.params.id}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationEdit);

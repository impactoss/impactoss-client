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

import { Map, List, fromJS } from 'immutable';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, redirectIfNotPermitted, updatePath } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import {
  taxonomyOptions,
  entityOptions,
  renderActionControl,
  renderTaxonomyControl,
} from 'utils/forms';

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
      associatedActions: entityOptions(actions),
    })
    : Map();
  };

  render() {
    const { recommendation, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;
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
                  viewDomain.form.data,
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
            { dataReady &&
              <EntityForm
                model="recommendationEdit.form.data"
                formData={viewDomain.form.data}
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
                      renderActionControl(this.props.actions),
                    ],
                    aside: renderTaxonomyControl(this.props.taxonomies),
                  },
                }}
              />
            }
          </Page>
        }
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
      let saveData = formData.set('recommendationCategories', taxonomies.reduce((updates, tax, taxId) => {
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
                recommendation_id: formData.get('id'),
              }))
              : payloads
          , List())),
        });
      }, Map({ delete: List(), create: List() })));

      // actions
      const formActionIds = getCheckedValuesFromOptions(formData.get('associatedActions'));
      // store associated Actions as { [action.id]: [association.id], ... }
      const associatedActions = actions.reduce((actionsAssociated, action) => {
        if (action.get('associated')) {
          return actionsAssociated.set(action.get('id'), action.get('associated').keySeq().first());
        }
        return actionsAssociated;
      }, Map());

      saveData = saveData.set('recommendationMeasures', Map({
        delete: associatedActions.reduce((associatedIds, associatedId, id) =>
          !formActionIds.includes(id)
            ? associatedIds.push(associatedId)
            : associatedIds
        , List()),
        create: formActionIds.reduce((payloads, id) =>
          !associatedActions.has(id)
            ? payloads.push(Map({
              measure_id: id,
              recommendation_id: formData.get('id'),
            }))
            : payloads
        , List()),
      }));

      dispatch(save(saveData.toJS()));
      // dispatch(save(formData, props.params.id));
    },
    handleCancel: () => {
      dispatch(updatePath(`/recommendations/${props.params.id}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationEdit);

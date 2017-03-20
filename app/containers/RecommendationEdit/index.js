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

    if (this.props.recommendation && this.props.recommendationsReady) {
      this.props.populateForm('recommendationEdit.form.recommendation', fromJS(this.props.recommendation.attributes));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.recommendation && nextProps.recommendationsReady && !this.props.recommendationsReady) {
      this.props.populateForm('recommendationEdit.form.recommendation', fromJS(nextProps.recommendation.attributes));
    }
  }

  mapCategoryOptions = (categories) => categories && Object.values(categories).map((cat) => ({
    value: cat.id,
    label: `${cat.attributes.title}${cat.connected ? ' - assigned' : ' - not assigned'}`,
  }));
  mapActionOptions = (actions) => actions && Object.values(actions).map((action) => ({
    value: action.id,
    label: `${action.attributes.title}${action.connected ? ' - connected' : ' - not connected'}`,
  }));

  renderTaxonomyControl = (taxonomies) => taxonomies && Object.values(taxonomies).map((tax) => ({
    id: tax.attributes.title,
    controlType: 'select',
    options: this.mapCategoryOptions(tax.categories),
  }));


  render() {
    const { recommendation, recommendationsReady } = this.props;
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
        { !recommendation && !recommendationsReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !recommendation && recommendationsReady &&
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
                onClick: () => this.props.handleSubmit(this.props.form.recommendation),
              },
            ]}
          >
            <EntityForm
              model="recommendationEdit.form.recommendation"
              handleSubmit={this.props.handleSubmit}
              handleCancel={this.props.handleCancel}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.title',
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
                      model: '.draft',
                      value: recommendation.draft,
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
                    {
                      id: 'actions',
                      controlType: 'select',
                      options: this.mapActionOptions(this.props.actions),
                    },
                  ],
                  aside: this.renderTaxonomyControl(this.props.taxonomies),
                },
              }}
            />
          </Page>
        }
        {saveSending &&
          <p>Saving</p>
        }
        {saveError &&
          <p>{saveError}</p>
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
  recommendationsReady: PropTypes.bool,
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
  recommendationsReady: isReady(state, { path: 'recommendations' }),
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
          as: 'assigned',
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
        as: 'connected',
        path: 'recommendation_measures',
        key: 'action_id',
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
    populateForm: (model, data) => {
      dispatch(formActions.load(model, data));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData, props.params.id));
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

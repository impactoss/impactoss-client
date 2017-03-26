/*
 *
 * ActionNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';
import { reduce } from 'lodash/collection';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';


import Page from 'components/Page';
import EntityForm from 'components/EntityForm';


import {
  getEntities,
  isReady,
} from 'containers/App/selectors';

import actionNewSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
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
    const { dataReady } = this.props;
    const { saveSending, saveError } = this.props.actionNew.page;
    const required = (val) => val && val.length;


    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        { !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        {dataReady &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={
              [
                {
                  type: 'simple',
                  title: 'Cancel',
                  onClick: this.props.handleCancel,
                },
                {
                  type: 'primary',
                  title: 'Save',
                  onClick: () => this.props.handleSubmit(
                    this.props.actionNew.form.data,
                  ),
                },
              ]
            }
          >
            {saveSending &&
              <p>Saving Action</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }
            <EntityForm
              model="actionNew.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
              )}
              handleCancel={this.props.handleCancel}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.attributes.title',
                      placeholder: this.context.intl.formatMessage(messages.fields.title.placeholder),
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
                      id: 'status',
                      controlType: 'select',
                      model: '.attributes.draft',
                      options: PUBLISH_STATUSES,
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

ActionNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  actionNew: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
};

ActionNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  actionNew: actionNewSelector(state),
  // all categories for all taggable taxonomies
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
    'recommendations',
  ] }),
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
      },
      out: 'js',
    },
  ),
  // all recommendations,
  recommendations: getEntities(
    state, {
      path: 'recommendations',
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      // dispatch(loadEntitiesIfNeeded('measures'));
      // dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      // dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      // dispatch(loadEntitiesIfNeeded('measure_categories'));
    },
    handleSubmit: (formData) => {
      const saveData = formData.toJS();

      // measureCategories
      if (saveData.associatedTaxonomies) {
        saveData.measureCategories = reduce(saveData.associatedTaxonomies, (updates, formCategoryIds) => ({
          delete: [],
          create: updates.create.concat(formCategoryIds.map((catId) => ({
            category_id: catId,
          }))),
        }), { delete: [], create: [] });
      }

      // recommendations
      if (saveData.associatedRecommendations) {
        saveData.recommendationMeasures = {
          delete: [],
          create: saveData.associatedRecommendations.map((recId) => ({
            recommendation_id: recId,
          })),
        };
      }

      dispatch(save(saveData));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push('/actions');
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionNew);

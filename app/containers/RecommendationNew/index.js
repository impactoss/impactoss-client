/*
*
* RecommendationNew
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
import { getEntities, isReady } from 'containers/App/selectors';

import Page from 'components/Page';
import EntityForm from 'components/EntityForm';

import recommendationNewSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class RecommendationNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
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
    const { dataReady } = this.props;
    const { saveSending, saveError } = this.props.recommendationNew.page;
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
                    this.props.recommendationNew.form.data
                  ),
                },
              ]
            }
          >
            {saveSending &&
              <p>Saving Recommendation</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }
            <EntityForm
              model="recommendationNew.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
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
                      id: 'number',
                      controlType: 'input',
                      model: '.attributes.number',
                    },
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

RecommendationNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  recommendationNew: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  actions: PropTypes.object,
};

RecommendationNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  recommendationNew: recommendationNewSelector(state),
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
    'measures',
  ] }),
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
      },
      out: 'js',
    },
  ),
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('measures'));
    },
    handleSubmit: (formData) => {
      const saveData = formData.toJS();

      // measureCategories
      if (saveData.associatedTaxonomies) {
        saveData.recommendationCategories = reduce(saveData.associatedTaxonomies, (updates, formCategoryIds) => ({
          delete: [],
          create: updates.create.concat(formCategoryIds.map((catId) => ({
            category_id: catId,
          }))),
        }), { delete: [], create: [] });
      }

      // actions
      if (saveData.associatedActions) {
        saveData.recommendationMeasures = {
          delete: [],
          create: saveData.associatedActions.map((actionId) => ({
            measure_id: actionId,
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
      browserHistory.push('/recommendations');
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendationNew);

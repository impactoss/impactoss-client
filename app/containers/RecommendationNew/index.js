/*
*
* RecommendationNew
*
*/

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import collection from 'lodash/collection';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';


import Page from 'components/Page';
import EntityForm from 'components/EntityForm';


import {
  getEntities,
} from 'containers/App/selectors';

import recommendationNewSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class RecommendationNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { saveSending, saveError } = this.props.recommendationNew.page;
    const required = (val) => val && val.length;

    const taxonomyOptions = collection.map(this.props.taxonomiesExtended, (tax) => ({
      id: tax.attributes.title,
      controlType: 'select',
      options: collection.map(tax.categories, (cat) => ({
        value: cat.id,
        label: cat.attributes.title,
      })),
    }));

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
                onClick: () => this.props.handleSubmit(this.props.recommendationNew.form.recommendation),
              },
            ]
          }
        >
          <EntityForm
            model="recommendationNew.form.recommendation"
            handleSubmit={this.props.handleSubmit}
            handleCancel={this.props.handleCancel}
            fields={{
              header: {
                main: [
                  {
                    id: 'title',
                    controlType: 'input',
                    model: '.title',
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
                    model: '.number',
                  },
                  {
                    id: 'status',
                    controlType: 'select',
                    model: '.draft',
                    options: PUBLISH_STATUSES,
                  },
                ],
              },
              body: {
                main: [
                  {
                    id: 'actions',
                    controlType: 'select',
                    options: collection.map(this.props.actions, (action) => ({
                      value: action.id,
                      label: action.attributes.title,
                    })),
                  },
                ],
                aside: taxonomyOptions,
              },
            }}
          />
        </Page>
        {saveSending &&
          <p>Saving Recommendation</p>
        }
        {saveError &&
          <p>{saveError}</p>
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
  taxonomiesExtended: PropTypes.object,
  actions: PropTypes.object,
};

RecommendationNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  recommendationNew: recommendationNewSelector(state),
  taxonomiesExtended: getEntities(
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
      dispatch(save(formData));
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

/*
 *
 * ActionNew
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

import actionNewSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { saveSending, saveError } = this.props.actionNew.page;
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
                onClick: () => this.props.handleSubmit(this.props.actionNew.form.action),
              },
            ]
          }
        >
          <EntityForm
            model="actionNew.form.action"
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
                    id: 'description',
                    controlType: 'textarea',
                    model: '.description',
                  },
                  {
                    id: 'recommendations',
                    controlType: 'select',
                    options: collection.map(this.props.recommendations, (rec) => ({
                      value: rec.id,
                      label: rec.attributes.title,
                    })),
                  },
                ],
                aside: taxonomyOptions,
              },
            }}
          />
        </Page>
        {saveSending &&
          <p>Saving Action</p>
        }
        {saveError &&
          <p>{saveError}</p>
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
  taxonomiesExtended: PropTypes.object,
  recommendations: PropTypes.object,
};

ActionNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  actionNew: actionNewSelector(state),
  taxonomiesExtended: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_measures: true,
      },
      extend: {
        path: 'categories',
        on: 'taxonomy_id',
      },
      out: 'js',
    },
  ),
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
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData));
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

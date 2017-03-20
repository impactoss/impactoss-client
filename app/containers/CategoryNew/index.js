/*
 *
 * CategoryNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';


import Page from 'components/Page';
import EntityForm from 'components/EntityForm';


import categoryNewSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class CategoryNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { saveSending, saveError } = this.props.categoryNew.page;
    const required = (val) => val && val.length;
    const taxonomyReference = this.props.params.id;

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
                onClick: () => this.props.handleCancel(taxonomyReference),
              },
              {
                type: 'primary',
                title: 'Save',
                onClick: () => this.props.handleSubmit(this.props.categoryNew.form.category, taxonomyReference),
              },
            ]
          }
        >
          <EntityForm
            model="categoryNew.form.category"
            handleSubmit={(formData) => this.props.handleSubmit(formData, taxonomyReference)}
            handleCancel={() => this.props.handleCancel(taxonomyReference)}
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
                    id: 'short_title',
                    controlType: 'input',
                    model: '.short_title',
                  },
                  {
                    id: 'url',
                    controlType: 'input',
                    model: '.url',
                  },
                ],
              },
            }}
          />
        </Page>
        {saveSending &&
          <p>Saving Category</p>
        }
        {saveError &&
          <p>{saveError}</p>
        }

      </div>
    );
  }
}

CategoryNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  categoryNew: PropTypes.object,
  params: PropTypes.object,
};

CategoryNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  categoryNew: categoryNewSelector(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
    },
    handleSubmit: (formData, taxonomyReference) => {
      dispatch(save(formData.set('taxonomy_id', taxonomyReference)));
    },
    handleCancel: (taxonomyReference) => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/categories/${taxonomyReference}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryNew);

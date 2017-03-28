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
import { getEntity, isReady } from 'containers/App/selectors';

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
    const { taxonomy, dataReady } = this.props;
    const { saveSending, saveError } = this.props.categoryNew.page;
    const taxonomyReference = this.props.params.id;
    const required = (val) => val && val.length;


    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);

    if (taxonomy && taxonomy.attributes) {
      pageTitle = `${pageTitle} (${taxonomy.attributes.title})`;
    }

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        {dataReady &&
          <Page
            title={pageTitle}
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
                  onClick: () => this.props.handleSubmit(
                    this.props.categoryNew.form.data,
                    taxonomyReference
                  ),
                },
              ]
            }
          >
            {saveSending &&
              <p>Saving Category</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }

            <EntityForm
              model="categoryNew.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                taxonomyReference
              )}
              handleCancel={() => this.props.handleCancel(taxonomyReference)}
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

                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.attributes.description',
                    },
                    {
                      id: 'short_title',
                      controlType: 'input',
                      model: '.attributes.short_title',
                    },
                    {
                      id: 'url',
                      controlType: 'input',
                      model: '.attributes.url',
                    },
                  ],
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

CategoryNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  categoryNew: PropTypes.object,
  taxonomy: PropTypes.object,
  params: PropTypes.object,
};

CategoryNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  categoryNew: categoryNewSelector(state),
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
  ] }),
  taxonomy: getEntity(
    state,
    {
      id: props.params.id,
      path: 'taxonomies',
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
    },
    handleSubmit: (formData, taxonomyReference) => {
      const saveData = formData.toJS();
      saveData.attributes.taxonomy_id = taxonomyReference;
      dispatch(save(saveData));
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

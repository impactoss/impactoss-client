/*
 *
 * PageNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import pageNewSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class PageNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { saveSending, saveError } = this.props.pageNew.page;
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
                  this.props.pageNew.form.data,
                ),
              },
            ]
          }
        >
          {saveSending &&
            <p>Saving Page</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          <EntityForm
            model="pageNew.form.data"
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
                  {
                    id: 'menuTitle',
                    controlType: 'input',
                    label: 'Menu title',
                    model: '.attributes.menu_title',
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
                    id: 'content',
                    controlType: 'textarea',
                    model: '.attributes.content',
                  },
                ],
                aside: [],
              },
            }}
          />
        </Page>
      </div>
    );
  }
}

PageNew.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  pageNew: PropTypes.object,
};

PageNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pageNew: pageNewSelector(state),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      // let saveData = formData;

      dispatch(save(formData.toJS()));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push('/pages');
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageNew);

/*
 *
 * ActionNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';

import { PUBLISH_STATUSES } from 'containers/App/constants';


import Page from 'components/Page';
import EntityForm from 'components/EntityForm';

import makeSelectActionNew from './selectors';
import messages from './messages';
import { save } from './actions';


export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { saveSending, saveError } = this.props.ActionNew.page;
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
                onClick: () => this.props.handleSubmit(this.props.ActionNew.form.action),
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
                ],
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
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  ActionNew: PropTypes.object,
};

ActionNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ActionNew: makeSelectActionNew(),
});

function mapDispatchToProps(dispatch) {
  return {
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

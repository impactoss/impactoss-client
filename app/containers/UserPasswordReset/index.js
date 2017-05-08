/*
 *
 * UserPasswordReset
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import Page from 'components/Page';
import SimpleForm from 'components/forms/SimpleForm';

import { updatePath } from 'containers/App/actions';

import { reset } from './actions';
import makeUserPasswordResetSelector from './selectors';
import messages from './messages';

export class UserPasswordReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
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
                title: 'Reset',
                onClick: () => this.props.handleSubmit(
                  this.props.userPasswordReset.form.data
                ),
              },
            ]
          }
        >
          { this.props.userPasswordReset.form &&
            <SimpleForm
              model="userPasswordReset.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: 'Reset password' }}
              fields={[
                {
                  id: 'email',
                  controlType: 'input',
                  model: '.email',
                  placeholder: this.context.intl.formatMessage(messages.fields.email.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
              ]}
            />
          }
        </Page>
      </div>
    );
  }
}

UserPasswordReset.propTypes = {
  userPasswordReset: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

UserPasswordReset.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userPasswordReset: makeUserPasswordResetSelector(),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(reset(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPasswordReset);

/*
 *
 * UserPasswordReset
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';

import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';

import { updatePath } from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { reset } from './actions';
import makeUserPasswordResetSelector from './selectors';

export class UserPasswordReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { resetSending, resetError } = this.props.userPasswordReset.page;
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
        <ContentNarrow>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
          />
          {resetSending &&
            <p>Sending... </p>
          }
          {resetError &&
            <p>{resetError}</p>
          }
          { this.props.userPasswordReset.form &&
            <AuthForm
              model="userPasswordReset.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
              fields={[
                {
                  id: 'password',
                  controlType: 'input',
                  model: '.password',
                  type: 'password',
                  placeholder: this.context.intl.formatMessage(messages.fields.password.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
                {
                  id: 'passwordConfirmation',
                  controlType: 'input',
                  model: '.passwordConfirmation',
                  type: 'password',
                  placeholder: this.context.intl.formatMessage(messages.fields.passwordConfirmation.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
              ]}
            />
          }
        </ContentNarrow>
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

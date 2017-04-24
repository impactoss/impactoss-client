/*
 *
 * UserRegister
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import Page from 'components/Page';
import SimpleForm from 'components/forms/SimpleForm';

import { updatePath } from 'containers/App/actions';

import userRegisterSelector from './selectors';
import messages from './messages';
import { register } from './actions';


export class UserRegister extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    // const { email, password, passwordConfirmation, name, register: { error, messages: message } } = this.props.UserRegister;
    const { registerSending, registerError } = this.props.userRegister.page;
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
                title: 'Register',
                onClick: () => this.props.handleSubmit(
                  this.props.userRegister.form.data
                ),
              },
            ]
          }
        >
          {registerSending &&
            <p>Registering</p>
          }
          {registerError &&
            <p>{registerError}</p>
          }
          <Link to="login">Already have an account? Log in here</Link>
          { this.props.userRegister.form &&
            <SimpleForm
              model="userRegister.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: 'Register' }}
              fields={[
                {
                  id: 'name',
                  controlType: 'input',
                  model: '.attributes.name',
                  placeholder: this.context.intl.formatMessage(messages.fields.name.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
                {
                  id: 'email',
                  controlType: 'input',
                  model: '.attributes.email',
                  placeholder: this.context.intl.formatMessage(messages.fields.email.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
                {
                  id: 'password',
                  controlType: 'input',
                  model: '.attributes.password',
                  placeholder: this.context.intl.formatMessage(messages.fields.password.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
                {
                  id: 'passwordConfirmation',
                  controlType: 'input',
                  model: '.attributes.passwordConfirmation',
                  placeholder: this.context.intl.formatMessage(messages.fields.passwordConfirmation.placeholder),
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

UserRegister.propTypes = {
  userRegister: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

UserRegister.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userRegister: userRegisterSelector(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(register(formData.toJS()));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      dispatch(updatePath('/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);

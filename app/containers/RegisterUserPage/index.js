/*
 *
 * RegisterUserPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import Input from 'components/Input';
import Form from 'components/Form';

import { changeEmail, changePassword, changePasswordConfirmation, changeName, submitForm } from './actions';
import makeSelectRegisterUserPage from './selectors';
import messages from './messages';


export class RegisterUserPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { email, password, passwordConfirmation, name, register: { error, messages: message } } = this.props.RegisterUserPage;

    return (
      <div>
        <Helmet
          title="RegisterUserPage"
          meta={[
            { name: 'description', content: 'Description of RegisterUserPage' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Form onSubmit={this.props.onSubmitForm}>
          <label htmlFor="name">
            <FormattedMessage {...messages.name} />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={this.props.onChangeName}
            />
          </label>
          <label htmlFor="email">
            <FormattedMessage {...messages.email} />
            <Input
              id="email"
              type="text"
              value={email}
              onChange={this.props.onChangeEmail}
            />
          </label>
          <label htmlFor="password">
            <FormattedMessage {...messages.password} />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={this.props.onChangePassword}
            />
          </label>
          <label htmlFor="passwordConfirmation">
            <FormattedMessage {...messages.passwordConfirmation} />
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={this.props.onChangePasswordConfirmation}
            />
          </label>
          <button><FormattedMessage {...messages.submit} /></button>
        </Form>
        {error &&
          message.map((errorMessage, i) =>
            <p key={i}>{errorMessage}</p>
          )
        }
      </div>
    );
  }
}

RegisterUserPage.propTypes = {
  RegisterUserPage: PropTypes.object,
  register: PropTypes.object,
  name: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  passwordConfirmation: PropTypes.string,
  onSubmitForm: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangePassword: PropTypes.func,
  onChangePasswordConfirmation: PropTypes.func,
  onChangeName: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  RegisterUserPage: makeSelectRegisterUserPage(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeName: (evt) => {
      dispatch(changeName(evt.target.value));
    },
    onChangeEmail: (evt) => {
      dispatch(changeEmail(evt.target.value));
    },
    onChangePassword: (evt) => {
      dispatch(changePassword(evt.target.value));
    },
    onChangePasswordConfirmation: (evt) => {
      dispatch(changePasswordConfirmation(evt.target.value));
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(submitForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserPage);

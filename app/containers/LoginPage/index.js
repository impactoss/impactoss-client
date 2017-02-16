/*
 *
 * LoginPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { makeSelectAuth } from 'containers/App/selectors';
import makeSelectLoginPage from './selectors';
import { changeEmail, changePassword, submitForm } from './actions';
import messages from './messages';
import Input from './Input';
import Form from './Form';

export class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { email, password } = this.props.LoginPage;
    const { error, messages: message } = this.props.Authentication;
    return (
      <div>
        <div>
          <FormattedMessage {...messages.header} />
        </div>
        <Form onSubmit={this.props.onSubmitForm}>
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
          <button>Sign in</button>
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

LoginPage.propTypes = {
  LoginPage: PropTypes.object.isRequired,
  Authentication: PropTypes.object,
  onSubmitForm: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangePassword: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  LoginPage: makeSelectLoginPage(),
  Authentication: makeSelectAuth(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeEmail: (evt) => {
      dispatch(changeEmail(evt.target.value));
    },
    onChangePassword: (evt) => {
      dispatch(changePassword(evt.target.value));
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(submitForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

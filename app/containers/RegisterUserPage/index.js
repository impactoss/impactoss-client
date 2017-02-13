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

import { changeEmail, changePassword, changeVerify, submitForm } from './actions';
import makeSelectRegisterUserPage from './selectors';
import messages from './messages';


export class RegisterUserPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { email, password, verify } = this.props;
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
          <label htmlFor="verify">
            <FormattedMessage {...messages.verify} />
            <Input
              id="verify"
              type="password"
              value={verify}
              onChange={this.props.onChangeVerify}
            />
          </label>
          <button><FormattedMessage {...messages.submit} /></button>
        </Form>
      </div>
    );
  }
}

RegisterUserPage.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  verify: PropTypes.string,
  onSubmitForm: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangePassword: PropTypes.func,
  onChangeVerify: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  RegisterUserPage: makeSelectRegisterUserPage(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeEmail: (evt) => {
      dispatch(changeEmail(evt.target.value));
    },
    onChangePassword: (evt) => {
      dispatch(changePassword(evt.target.value));
    },
    onChangeVerify: (evt) => {
      dispatch(changeVerify(evt.target.value));
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(submitForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUserPage);

/*
 *
 * UserLogin
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/basic/A';

import { updatePath } from 'containers/App/actions';
import { makeSelectAuth } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { login } from './actions';
import makeUserLoginSelector from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserLogin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { error, messages: message } = this.props.authentication;
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
          {error &&
            message.map((errorMessage, i) =>
              <p key={i}>{errorMessage}</p>
            )
          }
          { this.props.userLogin.form &&
            <AuthForm
              model="userLogin.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
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
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
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
              ]}
            />
          }
          <BottomLinks>
            <p>
              <FormattedMessage {...messages.registerLinkBefore} />
              <A
                href="/register"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink('/register');
                }}
              >
                <FormattedMessage {...messages.registerLink} />
                <Icon name="arrowRight" text textRight size="1em" />
              </A>
            </p>
            <p>
              <A
                href="/recoverpassword"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink('/recoverpassword');
                }}
              >
                <FormattedMessage {...messages.recoverPasswordLink} />
                <Icon name="arrowRight" text textRight size="1em" />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
      </div>
    );
  }
}

UserLogin.propTypes = {
  userLogin: PropTypes.object.isRequired,
  authentication: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
};

UserLogin.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userLogin: makeUserLoginSelector(),
  authentication: makeSelectAuth(),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(login(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
    handleLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);

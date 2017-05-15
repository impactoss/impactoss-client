/*
 *
 * UserRegister
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/basic/A';

import { updatePath } from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { register } from './actions';
import userRegisterSelector from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserRegister extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    // const { registerSending, registerError } = this.props.userRegister.page;
    const { registerError } = this.props.userRegister.page;
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
          {registerError &&
            <p>{registerError}</p>
          }
          { this.props.userRegister.form &&
            <AuthForm
              model="userRegister.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
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
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
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
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
                {
                  id: 'password',
                  controlType: 'input',
                  type: 'password',
                  model: '.attributes.password',
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
                  type: 'password',
                  model: '.attributes.passwordConfirmation',
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
          <BottomLinks>
            <p>
              <FormattedMessage {...messages.loginLinkBefore} />
              <A
                href="/login"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink('/login');
                }}
              >
                <FormattedMessage {...messages.loginLink} />
                <Icon name="arrowRight" text textRight size="1em" />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
      </div>
    );
  }
}

UserRegister.propTypes = {
  userRegister: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
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
      dispatch(updatePath('/'));
    },
    handleLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);

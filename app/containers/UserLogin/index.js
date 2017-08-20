/*
 *
 * UserLogin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { actions as formActions } from 'react-redux-form/immutable';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';

import { updatePath } from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { login } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserLogin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.initialiseForm();
  }
  render() {
    const { authError, authSending } = this.props.viewDomain.page;
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
          {authError &&
            <ErrorMessages error={authError} />
          }
          {authSending &&
            <Loading />
          }
          { this.props.viewDomain.form &&
            <AuthForm
              model="userLogin.form.data"
              sending={authSending}
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
                <Icon name="arrowRight" text textRight />
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
                <Icon name="arrowRight" text textRight />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
      </div>
    );
  }
}

UserLogin.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  initialiseForm: PropTypes.func,
};

UserLogin.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userLogin.form.data'));
    },
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

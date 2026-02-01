/*
 *
 * UserLogin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import styled from 'styled-components';

import {
  getEmailFormField,
  getPasswordField,
} from 'utils/forms';

import ButtonHero from 'components/buttons/ButtonHero';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import OtpForm from 'components/forms/OtpForm';
import A from 'components/styled/A';

import { selectQueryMessages, selectOtpRequired, selectTempToken } from 'containers/App/selectors';
import {
  updatePath,
  dismissQueryMessages,
  verifyOtp,
  resendOtp,
  resetOtp,
} from 'containers/App/actions';

import { ROUTES } from 'containers/App/constants';
import { ENABLE_AZURE, IS_PROD, SERVER } from 'themes/config';
import messages from './messages';

import { login, loginWithAzure } from './actions';
import { selectDomain } from './selectors';
import { FORM_INITIAL } from './constants';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

const AzureButton = styled(ButtonHero)`
  margin-top: 10px;
  width: 100%;
`;


export class UserLogin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.props;
    const { authError, authSending } = this.props.viewDomain.get('page').toJS();

    const {
      handleSubmit,
      handleOtpSubmit,
      handleOtpResend,
      handleCancel,
      onDismissQueryMessages,
      queryMessages,
      handleSubmitWithAzure,
      otpRequired,
      tempToken,
      handleOtpCancel,
    } = this.props;

    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <ContentNarrow>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
          />
          {!IS_PROD && (
            <Messages
              type="info"
              messageKey="signingInServer"
              messageArgs={{ server: SERVER }}
            />
          )}
          {queryMessages.info
            && (
              <Messages
                type="info"
                onDismiss={onDismissQueryMessages}
                messageKey={queryMessages.info}
              />
            )
          }
          {authError
            && (
              <Messages
                type="error"
                messages={authError.messages}
              />
            )
          }
          {!ENABLE_AZURE && authSending
            && <Loading />
          }
          {!ENABLE_AZURE && !otpRequired && (
            <>
              <AuthForm
                sending={authSending}
                handleSubmit={(formData) => handleSubmit(formData)}
                handleCancel={handleCancel}
                initialValues={FORM_INITIAL}
                labels={{ submit: intl.formatMessage(messages.submit) }}
                fields={[
                  getEmailFormField(intl.formatMessage),
                  getPasswordField(intl.formatMessage),
                ]}
              />
              <BottomLinks>
                <p>
                  <FormattedMessage {...messages.registerLinkBefore} />
                  <A
                    href={ROUTES.REGISTER}
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.props.handleLink(ROUTES.REGISTER, { keepQuery: true });
                    }}
                  >
                    <FormattedMessage {...messages.registerLink} />
                    <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                  </A>
                </p>
                <p>
                  <A
                    href={ROUTES.RECOVER_PASSWORD}
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.props.handleLink(ROUTES.RECOVER_PASSWORD, { keepQuery: true });
                    }}
                  >
                    <FormattedMessage {...messages.recoverPasswordLink} />
                    <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                  </A>
                </p>
              </BottomLinks>
            </>
          )}
          {!ENABLE_AZURE && otpRequired && (
            <OtpForm
              sending={authSending}
              handleSubmit={(formData) => handleOtpSubmit(formData, tempToken)}
              handleResend={() => handleOtpResend(tempToken)}
              handleCancel={handleOtpCancel}
            />
          )}
          {ENABLE_AZURE && (
            <>
              <div>
                {!authSending && (
                  <AzureButton onClick={() => handleSubmitWithAzure()}>
                    <FormattedMessage {...messages.submitWithAzure} />
                  </AzureButton>
                )}
                {authSending && <Loading />}
              </div>
            </>
          )}
        </ContentNarrow>
      </div>
    );
  }
}

UserLogin.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSubmitWithAzure: PropTypes.func.isRequired,
  handleOtpSubmit: PropTypes.func.isRequired,
  handleOtpResend: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOtpCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  onDismissQueryMessages: PropTypes.func,
  queryMessages: PropTypes.object,
  otpRequired: PropTypes.bool,
  tempToken: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  queryMessages: selectQueryMessages(state),
  otpRequired: selectOtpRequired(state),
  tempToken: selectTempToken(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(login(formData));
      dispatch(dismissQueryMessages());
    },
    handleSubmitWithAzure: () => {
      dispatch(loginWithAzure());
    },
    handleOtpSubmit: (formData, tempToken) => {
      dispatch(verifyOtp({ temp_token: tempToken, otp_code: formData.otp_code }));
    },
    handleOtpResend: (tempToken) => {
      dispatch(resendOtp(tempToken));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
    handleOtpCancel: () => {
      dispatch(resetOtp());
    },
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserLogin));

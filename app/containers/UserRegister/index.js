/*
 *
 * UserRegister
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import styled from 'styled-components';

import {
  getNameField,
  getEmailFormField,
  getPasswordField,
  getPasswordConfirmationField,
} from 'utils/forms';

import Icon from 'components/Icon';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
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
} from 'containers/App/actions';

import { ROUTES } from 'containers/App/constants';
import { IS_PROD, SERVER } from 'themes/config';
import { FORM_INITIAL } from './constants';

import messages from './messages';

import { register } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserRegister extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      intl,
      handleCancel,
      handleSubmit,
      handleOtpSubmit,
      handleOtpResend,
      otpRequired,
      tempToken,
    } = this.props;
    const { registerError, registerSending } = this.props.viewDomain.get('page').toJS();

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
          <ContentHeader title={intl.formatMessage(messages.pageTitle)} />
          {!IS_PROD && <Messages type="info" messageKey="registeringServer" messageArgs={{ server: SERVER }} />}
          {this.props.queryMessages.info && (
            <Messages
              type="info"
              onDismiss={this.props.onDismissQueryMessages}
              messageKey={this.props.queryMessages.info}
            />
          )}
          {registerError && <Messages type="error" messages={registerError.messages} />}
          {registerSending && <Loading />}
          {!otpRequired && (
            <>
              <AuthForm
                sending={registerSending}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                labels={{ submit: intl.formatMessage(messages.submit) }}
                initialValues={FORM_INITIAL}
                fields={[
                  getNameField(intl.formatMessage),
                  getEmailFormField(intl.formatMessage),
                  getPasswordField(intl.formatMessage),
                  getPasswordConfirmationField(intl.formatMessage),
                ]}
              />
              <BottomLinks>
                <p>
                  <FormattedMessage {...messages.loginLinkBefore} />
                  <A
                    href={ROUTES.LOGIN}
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.props.handleLink(ROUTES.LOGIN, { keepQuery: true });
                    }}
                  >
                    <FormattedMessage {...messages.loginLink} />
                    <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                  </A>
                </p>
              </BottomLinks>
            </>
          )}
          {otpRequired && (
            <OtpForm
              sending={registerSending}
              handleSubmit={(formData) => handleOtpSubmit(formData, tempToken)}
              handleResend={() => handleOtpResend(tempToken)}
              handleCancel={handleCancel}
            />
          )}
        </ContentNarrow>
      </div>
    );
  }
}

UserRegister.propTypes = {
  viewDomain: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleOtpSubmit: PropTypes.func.isRequired,
  handleOtpResend: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
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
      dispatch(register(formData));
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
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserRegister));

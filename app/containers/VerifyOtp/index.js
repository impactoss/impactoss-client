/*
 *
 * VerifyOtp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import styled from 'styled-components';

import { getOtpCodeField } from 'utils/forms';

import Icon from 'components/Icon';
import Messages from 'components/Messages';
import Loading from 'components/Loading';

import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';

import {
  updatePath,
  resetOtp,
} from 'containers/App/actions';
import { selectIsOtpAfterRegister } from 'containers/App/selectors';

import messages from './messages';

import { selectDomain } from './selectors';
import {
  verifyOtp,
  resendOtp,
  resetErrors,
} from './actions';
import { FORM_INITIAL } from './constants';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

const Description = styled.p`
  margin-top: -12px;
  margin-bottom: 24px;
`;

export class VerifyOtp extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      intl,
      handleSubmit,
      handleOtpResend,
      handleCancel,
      viewDomain,
      isAfterRegister,
    } = this.props;
    const {
      authError,
      authSending,
      resendSending,
      resendSuccess,
      resendError,
    } = viewDomain.get('page').toJS();

    let title = isAfterRegister
      ? intl.formatMessage(messages.titleRegister)
      : intl.formatMessage(messages.titleSignIn);
    let description = isAfterRegister
      ? intl.formatMessage(messages.descriptionRegister)
      : intl.formatMessage(messages.descriptionSignIn);
    if (resendSuccess) {
      description = intl.formatMessage(messages.descriptionCodeResent);
      title = intl.formatMessage(messages.titleCodeResent);
    }
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
          <ContentHeader title={title} />
          <Description>{description}</Description>
          {(authError) && (
            <Messages
              type="error"
              messages={authError.messages}
            />
          )}
          {(resendError) && (
            <Messages
              type="error"
              messages={resendError.messages}
            />
          )}
          {(authSending || resendSending) && (
            <Loading />
          )}
          <AuthForm
            sending={authSending || resendSending}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            initialValues={FORM_INITIAL}
            labels={{ submit: intl.formatMessage(messages.submit) }}
            fields={[
              getOtpCodeField(intl.formatMessage),
            ]}
          />
          <BottomLinks>
            <p>
              <FormattedMessage {...messages.resendCodeLinkBefore} />
              <A
                href="#"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  handleOtpResend();
                }}
              >
                <FormattedMessage {...messages.resendCodeLink} />
                <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
      </div>
    );
  }
}

VerifyOtp.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleOtpResend: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  isAfterRegister: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  isAfterRegister: selectIsOtpAfterRegister(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: ({ otpCode }) => {
      dispatch(verifyOtp(otpCode));
    },
    handleOtpResend: (otpTempToken) => {
      dispatch(resetErrors());
      dispatch(resendOtp(otpTempToken));
    },
    handleCancel: () => {
      dispatch(resetErrors());
      dispatch(resetOtp());
      dispatch(updatePath('/'));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(VerifyOtp));

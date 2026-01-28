import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import styled from 'styled-components';

import ButtonSubmit from 'components/buttons/ButtonSubmit';
import ButtonCancel from 'components/buttons/ButtonCancel';
import Clear from 'components/styled/Clear';
import Main from 'components/EntityView/Main';
import ViewPanel from 'components/EntityView/ViewPanel';
import Field as FieldWrapper from 'components/fields/Field';

import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';
import Label from '../Label';
import Required from '../Required';
import ControlInput from '../ControlInput';

import messages from './messages';

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;

const OtpInput = styled(ControlInput)`
  font-size: 24px;
  letter-spacing: 8px;
  text-align: center;
  max-width: 300px;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #0077cc;
  cursor: pointer;
  text-decoration: underline;
  padding: 8px 0;
  font-size: 14px;

  &:hover {
    color: #005599;
  }

  &:disabled {
    color: #999;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const HelpText = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
`;

class OtpForm extends React.PureComponent {
  renderError = (name) => (
    <ErrorWrapper>
      <ErrorMessage
        className="errors"
        name={name}
      />
    </ErrorWrapper>
  );

  validateOtpCode = (value) => {
    if (!value) {
      return <FormattedMessage {...messages.otpCodeRequired} />;
    }
    if (!/^\d{6}$/.test(value)) {
      return <FormattedMessage {...messages.otpCodeInvalid} />;
    }
    return undefined;
  };

  render() {
    const { handleSubmit, handleCancel, handleResend, sending } = this.props;

    return (
      <Main hasAside={false}>
        <ViewPanel>
          <Formik
            initialValues={{ otp_code: '' }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <FormWrapper>
                <StyledForm>
                  <FormBody>
                    <FieldWrapper>
                      <Label htmlFor="otp_code">
                        <FormattedMessage {...messages.otpCode} />
                        <Required />
                      </Label>
                      <Field
                        as={OtpInput}
                        id="otp_code"
                        name="otp_code"
                        type="text"
                        placeholder="000000"
                        maxLength="6"
                        autoComplete="off"
                        validate={this.validateOtpCode}
                        disabled={sending || isSubmitting}
                      />
                      {this.renderError('otp_code')}
                    </FieldWrapper>
                    <HelpText>
                      <FormattedMessage {...messages.otpHelpText} />
                    </HelpText>
                    <div>
                      <ResendButton
                        type="button"
                        onClick={handleResend}
                        disabled={sending || isSubmitting}
                      >
                        <FormattedMessage {...messages.resendOtp} />
                      </ResendButton>
                    </div>
                  </FormBody>
                  <FormFooter>
                    <FormFooterButtons>
                      <ButtonSubmit
                        type="submit"
                        disabled={sending || isSubmitting}
                      >
                        <FormattedMessage {...messages.submit} />
                      </ButtonSubmit>
                      {handleCancel && (
                        <ButtonCancel
                          type="button"
                          onClick={handleCancel}
                          disabled={sending || isSubmitting}
                        >
                          <FormattedMessage {...messages.cancel} />
                        </ButtonCancel>
                      )}
                    </FormFooterButtons>
                  </FormFooter>
                  <Clear />
                </StyledForm>
              </FormWrapper>
            )}
          </Formik>
        </ViewPanel>
      </Main>
    );
  }
}

OtpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  handleResend: PropTypes.func.isRequired,
  sending: PropTypes.bool,
};

export default OtpForm;

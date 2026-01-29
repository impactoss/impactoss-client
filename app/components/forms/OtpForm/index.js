import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Formik, ErrorMessage } from 'formik';
import styled from 'styled-components';

import ButtonSubmit from 'components/buttons/ButtonSubmit';
import ButtonCancel from 'components/buttons/ButtonCancel';
import Clear from 'components/styled/Clear';
import Main from 'components/EntityView/Main';
import ViewPanel from 'components/EntityView/ViewPanel';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import Field from 'components/fields/Field';

import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';
import Label from '../Label';
import Required from '../Required';

import messages from './messages';

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;

const OtpInputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

const OtpDigitInput = styled.input`
  width: 40px;
  height: 60px;
  padding: 6px 2px;
  font-size: 22px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.2s;
  font-family: monospace;
  box-sizing: border-box;
  line-height: 1.4;

  @media (max-width: 768px) {
    width: 40px;
    height: 56px;
    font-size: 22px;
    padding: 8px 4px;
  }

  @media (max-width: 600px) {
    width: 36px;
    height: 52px;
    font-size: 20px;
    padding: 6px 3px;
  }

  &:focus {
    outline: none;
    border-color: #0077cc;
    box-shadow: 0 0 0 2px rgba(0, 119, 204, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &::selection {
    background-color: #0077cc;
    color: white;
  }
`;

const HelpText = styled.div`
  margin: 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #0077cc;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: 14px;
  margin-bottom: 16px;

  &:hover {
    color: #005599;
  }

  &:disabled {
    color: #999;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

class OtpForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.inputRefs = Array(6)
      .fill(0)
      .map(() => React.createRef());
  }

  handleDigitChange = (index, value, setFieldValue) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const currentValue = this.getCurrentValue();
    const newValue = currentValue.split('');
    newValue[index] = digit;
    setFieldValue('otp_code', newValue.join(''));

    if (digit && index < 5) {
      this.inputRefs[index + 1].current?.focus();
    }
  };

  handleDigitKeyDown = (index, e, setFieldValue) => {
    if (e.key === 'Backspace') {
      const currentValue = this.getCurrentValue();
      const newValue = currentValue.split('');

      if (!newValue[index] && index > 0) {
        newValue[index - 1] = '';
        setFieldValue('otp_code', newValue.join(''));
        this.inputRefs[index - 1].current?.focus();
      } else {
        newValue[index] = '';
        setFieldValue('otp_code', newValue.join(''));
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      this.inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      this.inputRefs[index + 1].current?.focus();
    }
  };

  handleDigitPaste = (e, setFieldValue) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setFieldValue('otp_code', pastedData.padEnd(6, ''));
    const nextIndex = Math.min(pastedData.length, 5);
    this.inputRefs[nextIndex].current?.focus();
  };

  getCurrentValue = () => this.inputRefs.map((ref) => ref.current?.value || '').join('');

  renderError = (name) => (
    <ErrorWrapper>
      <ErrorMessage className="errors" name={name} />
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
      <FormWrapper>
        <Formik
          initialValues={{ otp_code: '' }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {};
            const otpError = this.validateOtpCode(values.otp_code);
            if (otpError) {
              errors.otp_code = otpError;
            }
            return errors;
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <StyledForm>
              <FormBody>
                <ViewPanel>
                  <Main bottom>
                    <FieldGroupWrapper>
                      <Field>
                        <Label>
                          <FormattedMessage {...messages.otpCode} />
                          <Required>*</Required>
                        </Label>
                        <OtpInputContainer>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <OtpDigitInput
                              key={index}
                              ref={this.inputRefs[index]}
                              type="text"
                              inputMode="numeric"
                              maxLength="1"
                              value={values.otp_code[index] || ''}
                              onChange={(e) => this.handleDigitChange(index, e.target.value, setFieldValue)}
                              onKeyDown={(e) => this.handleDigitKeyDown(index, e, setFieldValue)}
                              onPaste={(e) => this.handleDigitPaste(e, setFieldValue)}
                              disabled={sending || isSubmitting}
                              autoComplete="off"
                              autoFocus={index === 0}
                            />
                          ))}
                        </OtpInputContainer>
                        {this.renderError('otp_code')}
                      </Field>
                      <HelpText>
                        <FormattedMessage {...messages.otpHelpText} />
                      </HelpText>
                      <div>
                        <ResendButton type="button" onClick={handleResend} disabled={sending || isSubmitting}>
                          <FormattedMessage {...messages.resendOtp} />
                        </ResendButton>
                      </div>
                    </FieldGroupWrapper>
                  </Main>
                </ViewPanel>
              </FormBody>
              <FormFooter>
                <FormFooterButtons>
                  <ButtonSubmit type="submit" disabled={sending || isSubmitting}>
                    <FormattedMessage {...messages.submit} />
                  </ButtonSubmit>
                  {handleCancel && (
                    <ButtonCancel type="button" onClick={handleCancel} disabled={sending || isSubmitting}>
                      <FormattedMessage {...messages.cancel} />
                    </ButtonCancel>
                  )}
                </FormFooterButtons>
              </FormFooter>
              <Clear />
            </StyledForm>
          )}
        </Formik>
      </FormWrapper>
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

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field as FormikField,
  Form,
  Formik,
  ErrorMessage,
} from 'formik';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Box, Text } from 'grommet';
import { CircleInformation, StatusGood } from 'grommet-icons';

import { omit } from 'lodash/object';
import { startCase } from 'lodash/string';

import { validateField } from 'utils/forms';

import appMessages from 'containers/App/messages';

import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Clear from 'components/styled/Clear';
import Main from 'components/EntityView/Main';
import ViewPanel from 'components/EntityView/ViewPanel';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import Field from 'components/fields/Field';
import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';

import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';
import Label from '../Label';
import Required from '../Required';
import ControlInput from '../ControlInput';

// These props will be omitted before being passed to the Control component
const nonControlProps = [
  'hint',
  'label',
  'component',
  'controlType',
  'children',
  'errorMessages',
  'validators',
  'showErrorsAsHints',
];

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;

const Hint = styled.div`
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes.text.smaller};
  margin-top: 0px;
  margin-bottom: 6px;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;


class AuthForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderError = (name) => (
    <ErrorWrapper id={`${name}-error`} role="alert">
      <ErrorMessage
        name={name}
        show="touched"
        component={(props) => (
          <Box direction="row" align="center" gap="xsmall" margin={{ top: 'small' }}>
            <CircleInformation
              aria-hidden="true"
              style={{ transform: 'rotate(180deg)' }}
              size="xxsmall"
              color="error"
            />
            <Text size="xsmall" color="error">
              {props.children}
            </Text>
          </Box>
        )}
      />
    </ErrorWrapper>
  );

  renderLabel = (field) => (
    <Label htmlFor={field.id}>
      {`${field.label || startCase(field.id)}`}
      {field.validators && field.validators.required
        && <Required>*</Required>
      }
    </Label>
  );

  renderField = (field) => {
    const { id, ...props } = omit(field, nonControlProps);
    return (
      <ControlInput
        id={id}
        {...props}
      />
    );
  };

  renderBody = (fieldConfigs, values) => (
    <FormBody>
      <ViewPanel>
        <Main bottom>
          <FieldGroupWrapper>
            {fieldConfigs.map((fieldConfig, i) => (
              <FormikField
                key={i}
                name={fieldConfig.id}
                validate={(value) => {
                  const invalid = validateField(value, fieldConfig);
                  if (invalid) return invalid;
                  // check cross field validation
                  if (fieldConfig.validateMatchAttribute) {
                    if (value !== values[fieldConfig.validateMatchAttribute]) {
                      return fieldConfig.errorMessages
                        ? fieldConfig.errorMessages.validateMatchAttribute
                        : 'Fields must match';
                    }
                  }

                  return undefined;
                }}
              >
                {({ field, meta }) => {
                  const value = values[fieldConfig.id];
                  const hasError = meta.touched && meta.error;
                  const isRequired = !!(fieldConfig.validators && fieldConfig.validators.required);
                  // Build describedby string
                  const describedBy = [];
                  if (fieldConfig.showErrorsAsHints) {
                    // Special mode: errors shown as hints in a combined element
                    describedBy.push(`${field.name}-hints`);
                  } else {
                    // Normal mode: separate hint and error
                    if (fieldConfig.hint) {
                      describedBy.push(`${field.name}-hint`);
                    }
                    if (hasError) {
                      describedBy.push(`${field.name}-error`);
                    }
                  }
                  const describedByAttr = describedBy.length > 0 && describedBy.join(' ');

                  return (
                    <Field>
                      {field.label !== false && this.renderLabel(fieldConfig)}
                      {fieldConfig.hint && (
                        <Hint id={`${field.name}-hint`}>
                          {fieldConfig.hint}
                        </Hint>
                      )}
                      {this.renderField({
                        ...fieldConfig,
                        ...field,
                        'aria-required': isRequired ? 'true' : 'false',
                        'aria-invalid': hasError ? 'true' : 'false',
                        'aria-describedby': describedByAttr,
                      })}
                      {meta.touched
                        && meta.error
                        && !fieldConfig.showErrorsAsHints
                        && this.renderError(field.name)
                      }
                      {fieldConfig.showErrorsAsHints
                        && fieldConfig.errorMessages
                        && fieldConfig.validators && (
                        <Box
                          id={`${field.name}-hints`}
                          role="list"
                          margin={{ top: 'small' }}
                          gap="xsmall"
                          aria-label="Password requirements"
                        >
                          {Object.keys(fieldConfig.errorMessages).map((errorKey) => {
                            let valid = true;
                            if (fieldConfig.validators[errorKey]) {
                              valid = !!fieldConfig.validators[errorKey](value);
                            }

                            // Skip certain validators
                            if (valid && errorKey === 'maxFieldLength') return null;
                            if (Object.keys(fieldConfig.errorMessages).indexOf('passwordLength') > -1
                                && errorKey === 'required') return null;

                            return (
                              <Box
                                key={errorKey}
                                direction="row"
                                align="center"
                                gap="xsmall"
                                role="listitem"
                              >
                                {!valid && (
                                  <CircleInformation
                                    aria-hidden="true"
                                    style={{ transform: 'rotate(180deg)', opacity: 0.5 }}
                                    size="xxsmall"
                                    color="textSecondary"
                                  />
                                )}
                                {valid && (
                                  <StatusGood
                                    aria-hidden="true"
                                    size="xxsmall"
                                    color="success"
                                  />
                                )}
                                <Text
                                  size="xsmall"
                                  color={valid ? 'success' : 'textSecondary'}
                                >
                                  <ScreenReaderOnly>
                                    {valid ? 'Satisfied: ' : 'Required: '}
                                  </ScreenReaderOnly>
                                  {fieldConfig.errorMessages[errorKey]}
                                </Text>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Field>
                  );
                }}
              </FormikField>
            ))}
          </FieldGroupWrapper>
        </Main>
      </ViewPanel>
    </FormBody>
  );

  render() {
    const {
      initialValues, fields, handleSubmit, handleCancel, labels, sending,
    } = this.props;

    return (
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, isValid, dirty }) => {
            const submitDisabled = !dirty // disabled if no changes are made
              || !isValid // or if validations fail
              || sending; // or already submitted

            return (
              <StyledForm>
                {fields && this.renderBody(fields, values)}
                <FormFooter>
                  <FormFooterButtons>
                    <ButtonCancel type="button" onClick={handleCancel}>
                      <FormattedMessage {...appMessages.buttons.cancel} />
                    </ButtonCancel>
                    {submitDisabled && (
                      <ScreenReaderOnly id="submit-disabled-hint">
                        The form is missing required input data or has validation errors
                      </ScreenReaderOnly>
                    )}
                    <ButtonSubmit
                      type="submit"
                      disabled={submitDisabled}
                      aria-disabled={submitDisabled ? 'true' : null}
                      aria-describedby={submitDisabled ? 'submit-disabled-hint' : null}
                    >
                      {labels.submit}
                    </ButtonSubmit>
                  </FormFooterButtons>
                  <Clear />
                </FormFooter>
              </StyledForm>
            );
          }}
        </Formik>
      </FormWrapper>
    );
  }
}

AuthForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  labels: PropTypes.object,
  fields: PropTypes.array,
  sending: PropTypes.bool,
  initialValues: PropTypes.object, // Map?
};
AuthForm.defaultProps = {
  sending: false,
};
export default AuthForm;

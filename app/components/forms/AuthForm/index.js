import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field as FormikField, Form, Formik, ErrorMessage,
} from 'formik';
import styled from 'styled-components';
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

class AuthForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderError = (name) => (
    <ErrorWrapper>
      <ErrorMessage
        className="errors"
        name={name}
        show="touched"
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

  renderBody = (fieldConfigs, values, errors) => {
    console.log(values, errors);
    return (
      <FormBody>
        <ViewPanel>
          <Main bottom>
            <FieldGroupWrapper>
              {fieldConfigs.map((fieldConfig, i) => (
                <FormikField
                  key={i}
                  name={fieldConfig.id}
                  validate={(value) => validateField(value, fieldConfig)}
                >
                  {({ field, meta }) => {
                    const value = values[fieldConfig.id];
                    return (
                      <Field>
                        {field.label !== false && this.renderLabel(fieldConfig)}
                        {this.renderField({ ...fieldConfig, ...field })}
                        {meta.touched
                          && meta.error
                          && !fieldConfig.showErrorsAsHints
                          && this.renderError(field.name)
                        }
                        {fieldConfig.showErrorsAsHints
                          && fieldConfig.errorMessages
                          && fieldConfig.validators && (
                          <Box margin={{ top: 'xsmall' }} gap="xsmall">
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
                                <Box key={errorKey} direction="row" align="center" gap="xsmall">
                                  {!valid && (
                                    <CircleInformation
                                      style={{ transform: 'rotate(180deg)', opacity: 0.5 }}
                                      size="xxsmall"
                                      color="textSecondary"
                                    />
                                  )}
                                  {valid && (
                                    <StatusGood
                                      size="xxsmall"
                                      color="success"
                                    />
                                  )}
                                  <Text
                                    size="xsmall"
                                    color={valid ? 'success' : 'textSecondary'}
                                  >
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
  };

  render() {
    const {
      initialValues, fields, handleSubmit, handleCancel, labels,
    } = this.props;

    return (
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, errors }) => (
            <StyledForm>
              {fields && this.renderBody(fields, values, errors)}
              <FormFooter>
                <FormFooterButtons>
                  <ButtonCancel type="button" onClick={handleCancel}>
                    <FormattedMessage {...appMessages.buttons.cancel} />
                  </ButtonCancel>
                  <ButtonSubmit type="submit" disabled={this.props.sending}>
                    {labels.submit}
                  </ButtonSubmit>
                </FormFooterButtons>
                <Clear />
              </FormFooter>
            </StyledForm>
          )}
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

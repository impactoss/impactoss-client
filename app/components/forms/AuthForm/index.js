import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Errors } from 'react-redux-form/immutable';

import { omit } from 'lodash/object';
import { startCase } from 'lodash/string';

import appMessages from 'containers/App/messages';

import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Clear from 'components/styled/Clear';

import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';
import Label from '../Label';
import Field from '../Field';
import Required from '../Required';
import ControlInput from '../ControlInput';

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];

class AuthForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderField = (field) => {
    const { id, model, ...props } = omit(field, nonControlProps);
    return (
      <ControlInput
        id={id}
        model={model || `.${id}`}
        {...props}
      />
    );
  }

  renderBody = (fields) => fields.map((field, i) => (
    <Field key={i}>
      { field.label !== false &&
        <Label htmlFor={field.id}>
          {`${field.label || startCase(field.id)}`}
          { field.validators && field.validators.required &&
            <Required>*</Required>
          }
        </Label>
      }
      {this.renderField(field)}
      {
        field.errorMessages &&
        <ErrorWrapper>
          <Errors
            className="errors"
            model={field.model}
            show="touched"
            messages={field.errorMessages}
          />
        </ErrorWrapper>
      }
    </Field>
  ))

  render() {
    const { fields, model, handleSubmit, handleCancel, labels } = this.props;
    return (
      <FormWrapper>
        <Form model={model} onSubmit={handleSubmit} >
          <FormBody>
            { fields && this.renderBody(fields) }
          </FormBody>
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
        </Form>
      </FormWrapper>
    );
  }
}

AuthForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  labels: PropTypes.object,
  model: PropTypes.string,
  fields: PropTypes.array,
  sending: PropTypes.bool,
};
AuthForm.defaultProps = {
  sending: false,
};
export default AuthForm;

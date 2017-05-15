import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Control, Form, Errors } from 'react-redux-form/immutable';

import { omit } from 'lodash/object';
import { startCase } from 'lodash/string';

import appMessages from 'containers/App/messages';

import ErrorWrapper from '../ErrorWrapper';
import FormWrapper from '../FormWrapper';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import ControlInfo from '../ControlInfo';
import ControlInput from '../ControlInput';
import ControlLink from '../ControlLink';
import ControlTextArea from '../ControlTextArea';
import ControlSelect from '../ControlSelect';
import ButtonCancel from '../ButtonCancel';
import ButtonSubmit from '../ButtonSubmit';
import Label from '../Label';
import Field from '../Field';
import Required from '../Required';

const controls = {
  input: ControlInput,
  textarea: ControlTextArea,
  info: ControlInfo,
  radio: Control.radio,
  checkbox: Control.checkbox,
  file: Control.file,
  select: ControlSelect,
  button: Control.button,
  link: ControlLink,
};

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];

class AuthForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getFieldComponent = (field) => {
    if (field.component) {
      return field.component; // Don't use this unless you really have to
    } else if (field.controlType in controls) {
      return controls[field.controlType];
    }
    return controls.input; // Default to input type if not specified
  }

  getControlProps = (field) => {
    switch (field.controlType) {
      case 'select': // we will render select options as children, so don't pass options prop directly to the control
        return omit(field, nonControlProps.concat(['options']));
      default:
        return omit(field, nonControlProps);
    }
  }

  renderField = (field) => {
    const FieldComponent = this.getFieldComponent(field);
    const { id, model, ...props } = this.getControlProps(field);
    return (
      <FieldComponent
        id={id}
        model={model || `.${id}`}
        {...props}
      >
        {this.renderFieldChildren(field)}
      </FieldComponent>
    );
  }

  renderSection = (fields) => fields.map((field, index) => (
    <Field key={index}>
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


  renderFieldChildren = (field) => {
    if (field.controlType === 'select' && field.options) { // handle known cases here
      return field.options.map((option, i) =>
        <option key={i} value={option.value} {...option.props}>{option.label}</option>);
    }
    if (field.controlType === 'info') { // handle known cases here
      return field.displayValue;
    }
    return field.children || null; // enables passing children component, or null
  }

  render() {
    const { fields } = this.props;

    return (
      <FormWrapper>
        <Form
          model={this.props.model}
          onSubmit={this.props.handleSubmit}
        >
          <FormBody>
            { fields &&
              this.renderSection(fields)
            }
          </FormBody>
          <FormFooter>
            <ButtonCancel onClick={this.props.handleCancel}>
              <FormattedMessage {...appMessages.buttons.cancel} />
            </ButtonCancel>
            <ButtonSubmit type="submit">
              {this.props.labels.submit}
            </ButtonSubmit>
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
};

export default AuthForm;

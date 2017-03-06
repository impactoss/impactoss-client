import React, { PropTypes } from 'react';
import { omit } from 'lodash/object';
import { startCase } from 'lodash/string';
import { Control, Form } from 'react-redux-form/immutable';

const controls = {
  input: Control.input,
  textarea: Control.textarea,
  radio: Control.radio,
  checkbox: Control.checkbox,
  file: Control.file,
  select: Control.select,
  button: Control.button,
};

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'options'];

class EntityForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getFieldComponent = (field) => {
    if (field.component) {
      return field.component; // Don't use this unless you really have to
    } else if (field.controlType in controls) {
      return controls[field.controlType];
    }
    return controls.input; // Default to input type if not specified
  }

  renderField = (field) => {
    const FieldComponent = this.getFieldComponent(field);
    const { id, model, ...props } = omit(field, nonControlProps);
    return (
      <FieldComponent id={id} model={model || `.${id}`} {...props} >
        {this.renderFieldChildren(field)}
      </FieldComponent>
    );
  }

  renderFieldChildren = (field) => {
    if (field.controlType === 'select' && field.options) { // handle known cases here
      return field.options.map((option, i) =>
        <option key={i} value={option.value} {...option.props}>{option.label}</option>);
    }
    return field.children || null; // enables passing children component, or null
  }

  render() {
    return (
      <Form
        model={this.props.model}
        onSubmit={this.props.handleSubmit}
      >
        {
          this.props.fields.map((field, index) => (
            <span key={index}>
              <label htmlFor={field.id}>{field.label || `${startCase(field.id)}:`}</label>
              {this.renderField(field)}
            </span>
          ))
        }
        <button type="submit">Save</button>
      </Form>
    );
  }
}

EntityForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  model: PropTypes.string,
  fields: PropTypes.array,
};

export default EntityForm;

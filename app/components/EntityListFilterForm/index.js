import React, { PropTypes } from 'react';
import { Form } from 'react-redux-form/immutable';
// import MultiSelect from 'components/MultiSelect';
import FormBody from './FormBody';
import FormFooter from './FormFooter';

class EntityListFilterForm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // renderField = (field) => {
  //   const FieldComponent = this.getFieldComponent(field);
  //   const { id, model, ...props } = this.getControlProps(field);
  //   return (
  //     <FieldComponent
  //       id={id}
  //       model={model || `.${id}`}
  //       {...props}
  //     >
  //       {this.renderFieldChildren(field)}
  //     </FieldComponent>
  //   );
  // }
  //
  // renderFilterGroup = (fields) => fields.map((field, index) => (
  //   <Field key={index}>
  //     <Label htmlFor={field.id}>
  //       {`${field.label || startCase(field.id)} ${field.validators && field.validators.required ? '*' : ''}`}
  //     </Label>
  //     {this.renderField(field)}
  //     {
  //       field.errorMessages &&
  //       <Errors
  //         className="errors"
  //         model={field.model}
  //         show="touched"
  //         messages={field.errorMessages}
  //       />
  //     }
  //   </Field>
  // ))

  //
  // renderFieldChildren = (field) => {
  //   if (field.controlType === 'select' && field.options) { // handle known cases here
  //     return field.options.map((option, i) =>
  //       <option key={i} value={option.value} {...option.props}>{option.label}</option>);
  //   }
  //   if (field.controlType === 'info') { // handle known cases here
  //     return field.displayValue;
  //   }
  //   return field.children || null; // enables passing children component, or null
  // }

  render() {
    return (
      <Form
        model={this.props.model}
        onSubmit={this.props.handleSubmit}
      >
        <FormBody>
        </FormBody>
        <FormFooter>
          <button onClick={this.props.handleCancel}>Cancel</button>
          <button type="submit">Save</button>
        </FormFooter>
      </Form>
    );
  }
}

EntityListFilterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  model: PropTypes.string,
};

export default EntityListFilterForm;

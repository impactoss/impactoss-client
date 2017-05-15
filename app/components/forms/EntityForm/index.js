import React, { PropTypes } from 'react';
import { omit } from 'lodash/object';
import { startCase } from 'lodash/string';
import { Control, Form, Errors } from 'react-redux-form/immutable';
import Grid from 'grid-styled';
import styled from 'styled-components';

import { lowerCase } from 'utils/string';

import Row from 'components/basic/Row';
import FormWrapper from 'components/basic/FormWrapper';
import MultiSelectControl from 'components/forms/MultiSelectControl';
import Uploader from 'components/forms/Uploader';
import FormHeader from '../FormHeader';
import FormBody from '../FormBody';
import FormFooter from '../FormFooter';
import ControlInfo from '../ControlInfo';
import ControlInput from '../ControlInput';
import ControlTextArea from '../ControlTextArea';
import ControlSelect from '../ControlSelect';
import Label from '../Label';
import Field from '../Field';

const controls = {
  input: ControlInput,
  textarea: ControlTextArea,
  info: ControlInfo,
  radio: Control.radio,
  checkbox: Control.checkbox,
  file: Control.file,
  select: ControlSelect,
  button: Control.button,
  multiselect: MultiSelectControl,
};

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];

const MultiSelectWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  height:300px;
  width: 100%;
  min-width: 350px;
  background: #fff;
  overflow: hidden;
  display: block;
  z-index: 10;
`;

class EntityForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      multiselectOpen: null,
    };
  }

  onLabelClick = (field) => {
    if (field.controlType === 'multiselect') {
      this.setState({
        multiselectOpen: this.state.multiselectOpen !== field.id ? field.id : null,
      });
    }
  }
  onCloseMultiselect = () => {
    this.setState({
      multiselectOpen: null,
    });
  }
  onMultiSelectItemRemove = (option, field) => {
    const fieldData = this.props.formData.getIn(field.dataPath);
    const formDataUpdated = this.props.formData.setIn(
      field.dataPath,
      fieldData.map((d) => {
        if (option.get('value') === d.get('value')) {
          return d.set('checked', false);
        }
        return d;
      })
    );
    if (this.props.handleUpdate) {
      this.props.handleUpdate(formDataUpdated);
    }
  }

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

  renderMultiselectActiveOptions = (options, field) =>
    options.map((option, i) => (
      <li key={i}>
        {`${option.get('label')} `}
        <a
          href="#remove"
          onClick={(evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            this.onMultiSelectItemRemove(option, field);
          }}
        >
          X
        </a>
      </li>
    ));

  renderField = (field) => {
    const FieldComponent = this.getFieldComponent(field);
    const { id, model, ...props } = this.getControlProps(field);
    if (field.controlType === 'multiselect') {
      let activeOptions;
      // use form data if already loaded
      if (this.props.formData.hasIn(field.dataPath)) {
        activeOptions = this.props.formData.getIn(field.dataPath).filter((o) => o.get('checked'));
      // untile then use initial options
      } else {
        activeOptions = field.options.filter((o) => o.get('checked'));
      }
      return (
        <div>
          {
            activeOptions.size > 0
            ? (
              <ul>{this.renderMultiselectActiveOptions(activeOptions, field)}</ul>
            )
            : (
              <a
                href="#add"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.onLabelClick(field);
                }}
              >{`Without ${lowerCase(field.label)}. Click to add`}</a>
            )
          }
          { this.state.multiselectOpen === id &&
            <MultiSelectWrapper>
              <FieldComponent
                id={id}
                model={model || `.${id}`}
                title={`Update ${lowerCase(field.label)}`}
                onCancel={this.onCloseMultiselect}
                buttons={[
                  {
                    type: 'primary',
                    title: 'Close',
                    onClick: this.onCloseMultiselect,
                  },
                ]}
                {...props}
              />
            </MultiSelectWrapper>
          }
        </div>
      );
    }
    if (field.controlType === 'uploader') {
      return (
        <Control.input
          model={model}
          component={Uploader}
        />
      );
    }
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

  renderSection = (fields) => fields.reduce((result, field, index) => {
    if (field) {
      result.push(
        <Field key={index}>
          <Label htmlFor={field.id} onClick={() => this.onLabelClick(field)}>
            {`${field.label || startCase(field.id)} ${field.validators && field.validators.required ? '*' : ''}`}
          </Label>
          {this.renderField(field)}
          {
            field.errorMessages &&
            <Errors
              className="errors"
              model={field.model}
              show="touched"
              messages={field.errorMessages}
            />
          }
        </Field>
      );
    }
    return result;
  }, [])


  render() {
    const { fields } = this.props;

    return (
      <FormWrapper>
        <Form
          model={this.props.model}
          onSubmit={this.props.handleSubmit}
        >
          {
            fields.header &&
            <FormHeader>
              <Row>
                <Grid sm={3 / 4}>
                  {
                    fields.header.main &&
                    this.renderSection(fields.header.main)
                  }
                </Grid>
                <Grid sm={1 / 4}>
                  {
                    fields.header.aside &&
                    this.renderSection(fields.header.aside)
                  }
                </Grid>
              </Row>
            </FormHeader>
          }
          { fields.body &&
            <FormBody>
              <Row>
                <Grid sm={3 / 4}>
                  {
                    fields.body.main &&
                    this.renderSection(fields.body.main)
                  }
                </Grid>
                <Grid sm={1 / 4}>
                  {
                    fields.body.aside &&
                    this.renderSection(fields.body.aside)
                  }
                </Grid>
              </Row>
            </FormBody>
          }
          <FormFooter>
            <button onClick={this.props.handleCancel}>Cancel</button>
            <button type="submit">Save</button>
          </FormFooter>
        </Form>
      </FormWrapper>
    );
  }
}

EntityForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func,
  model: PropTypes.string,
  fields: PropTypes.object,
  formData: PropTypes.object,
};


export default EntityForm;

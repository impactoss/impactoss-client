import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Control, Form, Errors } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { omit } from 'lodash/object';

import asArray from 'utils/as-array';
import { lowerCase } from 'utils/string';

import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import FieldFactory from 'components/fields/FieldFactory';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import GroupIcon from 'components/fields/GroupIcon';
import Label from 'components/fields/Label';
import FieldWrap from 'components/fields/FieldWrap';
import Field from 'components/fields/Field';

import UploadControl from '../UploadControl';
import MultiSelectControl from '../MultiSelectControl';
import FormWrapper from '../FormWrapper';
import FormPanel from '../FormPanel';
import FormFooter from '../FormFooter';
import Aside from '../Aside';
import Main from '../Main';
import FormFieldWrap from '../FormFieldWrap';
import ControlTitle from '../ControlTitle';
import ControlInput from '../ControlInput';
import ControlTextArea from '../ControlTextArea';
import ControlSelect from '../ControlSelect';
import ButtonCancel from '../ButtonCancel';
import ButtonSubmit from '../ButtonSubmit';
import Required from '../Required';

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
const MultiSelectLabel = styled.button`
  color: ${palette('greyscaleDark', 4)};
  font-weight: 500;
  font-size: 0.85em;
  width: 100%;
`;

const controls = {
  input: ControlInput,
  title: ControlTitle,
  textarea: ControlTextArea,
  select: ControlSelect,
  radio: Control.radio,
  checkbox: Control.checkbox,
  button: Control.button,
  file: UploadControl,
  uploader: UploadControl,
};

// These props will be omitted before being passed to the Control component
const nonControlProps = ['label', 'component', 'controlType', 'children', 'errorMessages'];


class EntityForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      multiselectOpen: null,
    };
  }
    // MULTISELECT
  onToggleMultiselect = (field) => {
    this.setState({
      multiselectOpen: this.state.multiselectOpen !== field.id ? field.id : null,
    });
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

  getControlProps = (field) => {
    switch (field.controlType) {
      case 'select': // we will render select options as children, so don't pass options prop directly to the control
        return omit(field, nonControlProps.concat(['options']));
      default:
        return omit(field, nonControlProps);
    }
  }

  // REGULAR COMPONENT
  getFieldComponent = (field) => {
    if (field.component) {
      return field.component; // Don't use this unless you really have to
    } else if (field.controlType in controls) {
      return controls[field.controlType];
    }
    return controls.input; // Default to input type if not specified
  }

  getMultiSelectActiveOptions = (field, formData) => {
    // use form data if already loaded
    if (formData.hasIn(field.dataPath)) {
      return formData.getIn(field.dataPath).filter((o) => o.get('checked'));
    // until then use initial options
    }
    return field.options.filter((o) => o.get('checked'));
  }

  renderMultiSelect = (field, formData) => {
    const { id, model, ...controlProps } = this.getControlProps(field);

    return (
      <div>
        <MultiSelectLabel
          onClick={(evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            this.onToggleMultiselect(field);
          }}
        >
          { field.label }
          { field.validators && field.validators.required &&
            <Required>*</Required>
          }
        </MultiSelectLabel>
        { this.renderMultiselectActiveOptions(field, formData) }
        { this.state.multiselectOpen === id &&
          <MultiSelectWrapper>
            <MultiSelectControl
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
              {...controlProps}
            />
          </MultiSelectWrapper>
        }
      </div>
    );
  }
  renderMultiselectActiveOptions = (field, formData) => {
    const options = this.getMultiSelectActiveOptions(field, formData);
    return (
      <div>
        {
          options.size > 0
          ? (
            <ul>
              { options.map((option, i) => (
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
              )) }
            </ul>
          )
          : (
            <a
              href="#add"
              onClick={(evt) => {
                if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                this.onToggleMultiselect(field);
              }}
            >
              {`Without ${lowerCase(field.label)}. Click to add`}
            </a>
          )
        }
      </div>
    );
  }
  renderFieldChildren = (field) => {
     // handle known cases here
    switch (field.controlType) {
      case 'select':
        return field.options && field.options.map((option, i) =>
          <option key={i} value={option.value} {...option.props}>{option.label}</option>
        );
      case 'info' :
        return field.displayValue;
      default:
        return field.children || null; // enables passing children component, or null
    }
  }
  renderComponent = (field) => {
    const { id, model, ...props } = this.getControlProps(field);
    const FieldComponent = this.getFieldComponent(field);
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
  renderCombo = (field) => (
    <FieldWrap>
      {
        field.fields.map((comboField, i) => (
          <span key={i}>
            { this.renderFormField(comboField, true) }
          </span>
        ))
      }
    </FieldWrap>
  );
  renderFormField = (field, nested) => {
    let formField;
    if (!field.controlType) {
      formField = this.renderComponent(field);
    } else {
      switch (field.controlType) {
        case 'info':
          formField = (<FieldFactory field={field} nested={nested} />);
          break;
        case 'combo':
          formField = this.renderCombo(field);
          break;
        case 'multiselect':
          formField = this.renderMultiSelect(field, this.props.formData);
          break;
        default:
          formField = this.renderComponent(field);
      }
    }
    return (
      <FormFieldWrap nested={nested}>
        { field.label && field.controlType !== 'multiselect' &&
          <Label htmlFor={field.id}>
            { field.label }
            { field.validators && field.validators.required &&
              <Required>*</Required>
            }
          </Label>
        }
        { formField }
      </FormFieldWrap>
    );
  }

  renderGroup = (group) => (
    <FieldGroupWrapper type={group.type}>
      { group.label &&
        <FieldGroupLabel>
          { group.icon &&
            <GroupIcon>
              <Icon name={group.icon} />
            </GroupIcon>
          }
          <Label>
            {group.label}
          </Label>
        </FieldGroupLabel>
      }
      {
        group.fields.map((field, i) => field
          ? (
            <Field key={i}>
              {this.renderFormField(field)}
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
          )
          : null
        )
      }
    </FieldGroupWrapper>
  )

  renderMain = (fieldGroups, aside) => (
    <Main aside={aside}>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => fieldGroup.fields && (
          <FormPanel key={i} borderRight={aside} borderBottom={i < (list.length - 1)}>
            {this.renderGroup(fieldGroup)}
          </FormPanel>
        ))
      }
    </Main>
  );
  renderAside = (fieldGroups) => (
    <Aside>
      {
        asArray(fieldGroups).map((fieldGroup, i, list) => (
          <FormPanel key={i} borderBottom={i < (list.length - 1)}>
            {this.renderGroup(fieldGroup)}
          </FormPanel>
        ))
      }
    </Aside>
  );

  render() {
    const { fields, model, handleSubmit, handleCancel } = this.props;
    return (
      <FormWrapper>
        <Form model={model} onSubmit={handleSubmit} >
          { fields.header &&
            <FormPanel borderBottom>
              { fields.header.main && this.renderMain(fields.header.main, !!fields.header.aside) }
              { fields.header.aside && this.renderAside(fields.header.aside) }
            </FormPanel>
          }
          { fields.body &&
            <FormPanel>
              { fields.body.main && this.renderMain(fields.body.main, true) }
              { fields.body.aside && this.renderAside(fields.body.aside) }
            </FormPanel>
          }
          <FormFooter>
            <ButtonCancel onClick={handleCancel}>
              <FormattedMessage {...appMessages.buttons.cancel} />
            </ButtonCancel>
            <ButtonSubmit type="submit">
              <FormattedMessage {...appMessages.buttons.save} />
            </ButtonSubmit>
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

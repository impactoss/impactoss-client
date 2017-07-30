import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Control, Form, Errors } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { omit } from 'lodash/object';

import asArray from 'utils/as-array';
import { lowerCase } from 'utils/string';

import appMessages from 'containers/App/messages';

import A from 'components/styled/A';
import Icon from 'components/Icon';
import FieldFactory from 'components/fields/FieldFactory';
import Button from 'components/buttons/Button';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import ButtonForm from 'components/buttons/ButtonForm';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import GroupIcon from 'components/fields/GroupIcon';
import Label from 'components/fields/Label';
import FieldWrap from 'components/fields/FieldWrap';
import Field from 'components/fields/Field';
import Clear from 'components/styled/Clear';

import UploadControl from '../UploadControl';
import MultiSelectControl from '../MultiSelectControl';
import FormWrapper from '../FormWrapper';
import FormPanel from '../FormPanel';
import FormFooter from '../FormFooter';
import FormFooterButtons from '../FormFooterButtons';
import Aside from '../Aside';
import Main from '../Main';
import FormFieldWrap from '../FormFieldWrap';
import ControlTitle from '../ControlTitle';
import ControlTitleText from '../ControlTitleText';
import ControlShort from '../ControlShort';
import ControlInput from '../ControlInput';
import ControlTextArea from '../ControlTextArea';
import ControlSelect from '../ControlSelect';
import MarkdownControl from '../MarkdownControl';
import DateControl from '../DateControl';
import RadioControl from '../RadioControl';
import Required from '../Required';

import messages from './messages';

const Hint = styled.span`
  color: ${palette('dark', 4)};
  padding-left: 5px;
`;

const DeleteWrapper = styled.div`
  float: left;
  padding-left: 40px;
`;

const ButtonDelete = styled(ButtonForm)`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1em;
  padding: 1em 1.2em;
  color: ${palette('buttonFlat', 0)};
  &:hover {
    color: ${palette('buttonFlatHover', 0)};
  }
`;

const ButtonPreDelete = styled(Button)`
  color: ${palette('dark', 3)};
  &:hover {
    color: ${palette('primary', 0)};
  }
`;

const MultiSelectWrapper = styled.div`
  position: absolute;
  top: 38px;
  right: 0;
  height:400px;
  width: 100%;
  min-width: 350px;
  background: #fff;
  overflow: hidden;
  display: block;
  z-index: 10;
`;
const MultiSelectFieldWrapper = styled.div`
  position: relative;
`;
const MultiselectActiveOptions = styled.div`
  position: relative;
`;
const MultiselectActiveOptionList = styled.div`
  position: relative;
`;
const MultiselectActiveOptionListItem = styled.div`
  position: relative;
  background-color: ${palette('primary', 4)};
  border-bottom: 1px solid ${palette('light', 1)};
  padding: 12px 0 12px 16px;
`;
const MultiselectActiveOptionRemove = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  padding: 0 16px;
  bottom: 0;
  &:hover {
    color: ${palette('primary', 1)};
  }
`;
const MultiselectActiveOption = styled.div`
  padding-right: 40px;
`;
const MultiSelectDropdownIcon = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 16px 0 0;
`;
const MultiSelectDropdown = styled(Button)`
  position: relative;
  width: 100%;
  font-size: 0.85em;
  text-align: left;
  color: ${palette('dark', 0)};
  background-color: ${palette('light', 1)};
  &:hover {
    color: ${palette('dark', 0)}
    background-color: ${palette('light', 2)}
  }
  padding: 12px 0 12px 16px;
`;

const MultiSelectWithout = styled.div`
  padding: 12px 0 12px 16px;
  color: ${palette('dark', 3)};
`;
const MultiSelectWithoutLink = styled(A)`
  color: ${palette('dark', 3)};
  &:hover {
    color: ${palette('linkDefault', 1)};
  }
`;
const Id = styled.div`
  font-weight: bold;
  color: ${palette('dark', 3)}
`;
const controls = {
  input: ControlInput,
  url: ControlInput,
  title: ControlTitle,
  titleText: ControlTitleText,
  short: ControlShort,
  textarea: ControlTextArea,
  markdown: MarkdownControl,
  date: DateControl,
  select: ControlSelect,
  radio: RadioControl,
  checkbox: Control.checkbox,
  button: Control.button,
  file: UploadControl,
  uploader: UploadControl,
};

// These props will be omitted before being passed to the Control component
const nonControlProps = ['hint', 'label', 'component', 'controlType', 'children', 'errorMessages'];


class EntityForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      multiselectOpen: null,
      deleteConfirmed: false,
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

  preDelete = (confirm = true) => {
    this.setState({ deleteConfirmed: confirm });
  }

  renderMultiSelect = (field, formData) => {
    const { id, model, ...controlProps } = this.getControlProps(field);

    return (
      <MultiSelectFieldWrapper>
        <MultiSelectDropdown
          onClick={(evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            this.onToggleMultiselect(field);
          }}
        >
          { field.label }
          <MultiSelectDropdownIcon>
            <Icon name={this.state.multiselectOpen === id ? 'dropdownClose' : 'dropdownOpen'} />
          </MultiSelectDropdownIcon>
        </MultiSelectDropdown>
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
      </MultiSelectFieldWrapper>
    );
  }
  renderMultiselectActiveOptions = (field, formData) => {
    const options = this.getMultiSelectActiveOptions(field, formData);
    return (
      <MultiselectActiveOptions>
        {
          options.size > 0
          ? (
            <MultiselectActiveOptionList>
              { options.map((option, i) => (
                <MultiselectActiveOptionListItem key={i}>
                  <MultiselectActiveOption>
                    { option.get('reference') &&
                      <Id>{option.get('reference')}</Id>
                    }
                    {option.get('label')}
                  </MultiselectActiveOption>
                  <MultiselectActiveOptionRemove
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.onMultiSelectItemRemove(option, field);
                    }}
                  >
                    <Icon name="removeSmall" />
                  </MultiselectActiveOptionRemove>
                </MultiselectActiveOptionListItem>
              )) }
            </MultiselectActiveOptionList>
          )
          : (
            <MultiSelectWithout>
              <FormattedMessage
                {...messages.empty}
                values={{ entities: lowerCase(field.label) }}
              />
              <MultiSelectWithoutLink
                href="#add"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.onToggleMultiselect(field);
                }}
              >
                <FormattedMessage {...messages.emptyLink} />
              </MultiSelectWithoutLink>
            </MultiSelectWithout>
          )
        }
      </MultiselectActiveOptions>
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
        { field.label && field.controlType !== 'multiselect' && field.controlType !== 'info' &&
          <Label htmlFor={field.id}>
            { field.label }
            { field.validators && field.validators.required &&
              <Required>*</Required>
            }
          </Label>
        }
        { formField }
        {field.hint &&
          <Hint>{field.hint}</Hint>
        }
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
            {this.props.handleDelete && !this.state.deleteConfirmed &&
              <DeleteWrapper>
                <ButtonPreDelete type="button" onClick={this.preDelete}>
                  <Icon name="trash" />
                </ButtonPreDelete>
              </DeleteWrapper>
            }
            {this.props.handleDelete && this.state.deleteConfirmed &&
              <DeleteWrapper>
                <FormattedMessage {...messages.confirmDeleteQuestion} />
                <ButtonCancel type="button" onClick={() => this.preDelete(false)}>
                  <FormattedMessage {...messages.buttons.cancelDelete} />
                </ButtonCancel>
                <ButtonDelete type="button" onClick={this.props.handleDelete}>
                  <FormattedMessage {...messages.buttons.confirmDelete} />
                </ButtonDelete>
              </DeleteWrapper>
            }
            {!this.state.deleteConfirmed &&
              <FormFooterButtons>
                <ButtonCancel type="button" onClick={handleCancel}>
                  <FormattedMessage {...appMessages.buttons.cancel} />
                </ButtonCancel>
                <ButtonSubmit type="submit">
                  <FormattedMessage {...appMessages.buttons.save} />
                </ButtonSubmit>
              </FormFooterButtons>
            }
            <Clear />
          </FormFooter>
        </Form>
      </FormWrapper>
    );
  }
}

EntityForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  model: PropTypes.string,
  fields: PropTypes.object,
  formData: PropTypes.object,
};
// EntityForm.controlTypes = {
//   intl: PropTypes.object.isRequired,
// };

export default EntityForm;

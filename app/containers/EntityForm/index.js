import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Control, Form, Errors } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { omit } from 'lodash/object';

import asArray from 'utils/as-array';
import appMessage from 'utils/app-message';

import { selectNewEntityModal } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import FieldFactory from 'components/fields/FieldFactory';

import Button from 'components/buttons/Button';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import ButtonForm from 'components/buttons/ButtonForm';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import GroupIcon from 'components/fields/GroupIcon';
import GroupLabel from 'components/fields/GroupLabel';
import FieldWrap from 'components/fields/FieldWrap';
import Field from 'components/fields/Field';
import Clear from 'components/styled/Clear';
import ViewPanel from 'components/EntityView/ViewPanel';

import FieldLabel from 'components/forms/Label';
import ErrorWrapper from 'components/forms/ErrorWrapper';
import UploadControl from 'components/forms/UploadControl';
import FormFooter from 'components/forms/FormFooter';
import FormBody from 'components/forms/FormBody';
import FormWrapper from 'components/forms/FormWrapper';
import FormFooterButtons from 'components/forms/FormFooterButtons';
import Aside from 'components/EntityView/Aside';
import Main from 'components/EntityView/Main';
import FormFieldWrap from 'components/forms/FormFieldWrap';
import ControlTitle from 'components/forms/ControlTitle';
import ControlTitleText from 'components/forms/ControlTitleText';
import ControlShort from 'components/forms/ControlShort';
import ControlInput from 'components/forms/ControlInput';
import ControlCheckbox from 'components/forms/ControlCheckbox';
import ControlTextArea from 'components/forms/ControlTextArea';
import ControlSelect from 'components/forms/ControlSelect';
import MarkdownControl from 'components/forms/MarkdownControl';
import DateControl from 'components/forms/DateControl';
import RadioControl from 'components/forms/RadioControl';
import Required from 'components/forms/Required';
import MultiSelectField from 'components/forms/MultiSelectField';

import messages from './messages';

const StyledForm = styled(Form)`
  display: table;
  width: 100%;
`;

const Hint = styled.div`
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes.text.small};
  margin-top: -6px;
`;

const DeleteConfirmText = styled.span`
  padding-left: 1em;
  padding-right: 1em;
`;
const DeleteWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
`;

const ButtonDelete = styled(ButtonForm)`
  color: ${palette('buttonFlat', 0)};
  &:hover {
    color: ${palette('buttonFlatHover', 0)};
  }
`;

const ButtonPreDelete = styled(Button)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  color: ${palette('text', 1)};
  &:hover {
    color: ${palette('linkHover', 2)};
  }
`;

const controls = {
  input: ControlInput,
  url: ControlInput,
  email: ControlInput,
  title: ControlTitle,
  titleText: ControlTitleText,
  short: ControlShort,
  textarea: ControlTextArea,
  markdown: MarkdownControl,
  date: DateControl,
  select: ControlSelect,
  radio: RadioControl,
  checkbox: ControlCheckbox,
  button: Control.button,
  file: UploadControl,
  uploader: UploadControl,
};

// These props will be omitted before being passed to the Control component
const NON_CONTROL_PROPS = ['hint', 'label', 'component', 'controlType', 'children', 'errorMessages'];


class EntityForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      deleteConfirmed: false,
    };
  }

  getControlProps = (field) => {
    switch (field.controlType) {
      case 'select': // we will render select options as children, so don't pass options prop directly to the control
        return omit(field, NON_CONTROL_PROPS.concat(['options']));
      default:
        return omit(field, NON_CONTROL_PROPS);
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

  preDelete = (confirm = true) => {
    this.setState({ deleteConfirmed: confirm });
  }

  handleSubmit = (formData) => !this.props.saving && this.props.handleSubmit(formData);

  renderMultiSelect = (field, formData, hasEntityNewModal) => (
    <MultiSelectField
      field={field}
      fieldData={formData.getIn(field.dataPath)}
      closeOnClickOutside={!hasEntityNewModal}
      handleUpdate={(fieldData) => this.props.handleUpdate(formData.setIn(field.dataPath, fieldData))}
    />
  )

  renderFieldChildren = (field) => {
     // handle known cases here
    switch (field.controlType) {
      case 'select':
        return field.options && field.options.map((option, i) =>
          <option key={i} value={option.value} {...option.props}>
            { option.message
               ? appMessage(this.context.intl, option.message)
               : (option.label || option.value)
            }
          </option>
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
  renderFormField = (field, nested, hasEntityNewModal) => {
    // field.controlType === 'date' && console.log('field', field)
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
          formField = this.renderMultiSelect(field, this.props.formData, hasEntityNewModal);
          break;
        default:
          formField = this.renderComponent(field);
      }
    }
    return (
      <FormFieldWrap nested={nested}>
        { field.label && field.controlType !== 'multiselect' && field.controlType !== 'info' &&
          <FieldLabel htmlFor={field.id} inline={field.controlType === 'checkbox'}>
            { field.controlType === 'checkbox' && formField }
            { field.label }
            { field.validators && field.validators.required &&
              <Required>*</Required>
            }
          </FieldLabel>
        }
        { field.hint &&
          <Hint>{field.hint}</Hint>
        }
        { field.controlType !== 'checkbox' && formField }
      </FormFieldWrap>
    );
  }

  renderGroup = (group, hasEntityNewModal) => (
    <FieldGroupWrapper type={group.type}>
      { group.label &&
        <FieldGroupLabel>
          <GroupLabel>
            {group.label}
          </GroupLabel>
          { group.icon &&
            <GroupIcon>
              <Icon name={group.icon} />
            </GroupIcon>
          }
        </FieldGroupLabel>
      }
      {
        group.fields.map((field, i) => field
          ? (
            <Field labelledGroup={!!group.label} key={i}>
              {this.renderFormField(field, false, hasEntityNewModal)}
              {
                field.errorMessages &&
                <ErrorWrapper>
                  <Errors
                    className="errors"
                    model={field.model}
                    show={(fieldValue) => fieldValue.touched || !fieldValue.pristine}
                    messages={field.errorMessages}
                  />
                </ErrorWrapper>
              }
            </Field>
          )
          : null
        )
      }
    </FieldGroupWrapper>
  )

  renderMain = (fieldGroups, hasAside = true, bottom = false, hasEntityNewModal = false) => (
    <Main hasAside={hasAside} bottom={bottom}>
      {
        asArray(fieldGroups).map((fieldGroup, i) => fieldGroup.fields && (
          <div key={i}>
            {this.renderGroup(fieldGroup, hasEntityNewModal)}
          </div>
        ))
      }
    </Main>
  );
  renderAside = (fieldGroups, bottom = false, hasEntityNewModal = false) => (
    <Aside bottom={bottom}>
      {
        asArray(fieldGroups).map((fieldGroup, i) => (
          <div key={i}>
            {this.renderGroup(fieldGroup, hasEntityNewModal)}
          </div>
        ))
      }
    </Aside>
  );

  render() {
    const { fields, model, handleCancel, handleSubmitFail, inModal, validators, newEntityModal } = this.props;
    const hasEntityNewModal = !!newEntityModal;

    return (
      <FormWrapper withoutShadow={inModal}>
        <StyledForm model={model} onSubmit={this.handleSubmit} onSubmitFailed={handleSubmitFail} validators={validators}>
          <FormBody>
            { fields.header &&
              <ViewPanel>
                { fields.header.main && this.renderMain(fields.header.main, !!fields.header.aside, false, hasEntityNewModal) }
                { fields.header.aside && this.renderAside(fields.header.aside, false, hasEntityNewModal) }
              </ViewPanel>
            }
            { fields.body &&
              <ViewPanel>
                { fields.body.main && this.renderMain(fields.body.main, true, true, hasEntityNewModal) }
                { fields.body.aside && this.renderAside(fields.body.aside, true, hasEntityNewModal) }
              </ViewPanel>
            }
          </FormBody>
          <FormFooter>
            {this.props.handleDelete && !this.state.deleteConfirmed &&
              <DeleteWrapper>
                <ButtonPreDelete type="button" onClick={this.preDelete}>
                  <Icon name="trash" />
                </ButtonPreDelete>
              </DeleteWrapper>
            }
            {this.props.handleDelete && this.state.deleteConfirmed &&
              <FormFooterButtons left>
                <DeleteConfirmText>
                  <FormattedMessage {...messages.confirmDeleteQuestion} />
                </DeleteConfirmText>
                <ButtonCancel type="button" onClick={() => this.preDelete(false)}>
                  <FormattedMessage {...messages.buttons.cancelDelete} />
                </ButtonCancel>
                <ButtonDelete type="button" onClick={this.props.handleDelete}>
                  <FormattedMessage {...messages.buttons.confirmDelete} />
                </ButtonDelete>
              </FormFooterButtons>
            }
            {!this.state.deleteConfirmed &&
              <FormFooterButtons>
                <ButtonCancel type="button" onClick={handleCancel}>
                  <FormattedMessage {...appMessages.buttons.cancel} />
                </ButtonCancel>
                <ButtonSubmit type="submit" disabled={this.props.saving}>
                  <FormattedMessage {...appMessages.buttons.save} />
                </ButtonSubmit>
              </FormFooterButtons>
            }
            <Clear />
          </FormFooter>
        </StyledForm>
      </FormWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  newEntityModal: selectNewEntityModal(state),
});

EntityForm.propTypes = {
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  model: PropTypes.string,
  fields: PropTypes.object,
  formData: PropTypes.object,
  inModal: PropTypes.bool,
  saving: PropTypes.bool,
  newEntityModal: PropTypes.object,
  validators: PropTypes.object,
};
EntityForm.defaultProps = {
  saving: false,
};

EntityForm.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(EntityForm);

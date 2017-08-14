import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { lowerCase } from 'utils/string';
import { getEntitySortComparator } from 'utils/sort';
import { omit } from 'lodash/object';
import Button from 'components/buttons/Button';
import A from 'components/styled/A';

import Icon from 'components/Icon';

import MultiSelectControl from '../MultiSelectControl';
import messages from './messages';

const MultiSelectWrapper = styled.div`
  position: absolute;
  top: 38px;
  right: 0;
  height:450px;
  width: 100%;
  min-width: 350px;
  overflow: hidden;
  display: block;
  z-index: 10;
  background-color: ${palette('primary', 4)};
  border-left: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  border-color: ${palette('light', 2)};
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
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

const NON_CONTROL_PROPS = ['hint', 'label', 'component', 'controlType', 'children', 'errorMessages'];

class MultiSelectField extends React.Component { // eslint-disable-line react/prefer-stateless-function

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
  onMultiSelectItemRemove = (option) =>
    this.props.handleUpdate && this.props.handleUpdate(
      this.props.fieldData.map((d) => option.get('value') === d.get('value')
        ? d.set('checked', false)
        : d
      )
    );

  getMultiSelectActiveOptions = (field, fieldData) => {
    // use form data if already loaded
    if (fieldData) {
      return this.sortOptions(fieldData.filter((o) => o.get('checked')));
    }
    // until then use initial options
    return this.sortOptions(field.options.filter((o) => o.get('checked')));
  }
  getOptionSortValueMapper = (option) => {
    if (option.get('order')) {
      return option.get('order');
    }
    if (option.get('reference')) {
      return option.get('reference');
    }
    return option.get('label');
  }
  sortOptions = (options) => options.sortBy(
    (option) => this.getOptionSortValueMapper(option),
    (a, b) => getEntitySortComparator(a, b, 'asc')
  )

  renderMultiselectActiveOption = (option, field, i) => (
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
  )

  render() {
    const { field, fieldData } = this.props;
    const { id, model, ...controlProps } = omit(field, NON_CONTROL_PROPS);

    const options = this.getMultiSelectActiveOptions(field, fieldData);

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
        <MultiselectActiveOptions>
          { options.size > 0
            ? (<MultiselectActiveOptionList>
              {options.map((option, i) => this.renderMultiselectActiveOption(option, field, i))}
            </MultiselectActiveOptionList>)
            : (<MultiSelectWithout>
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
            </MultiSelectWithout>)
          }
        </MultiselectActiveOptions>
        { this.state.multiselectOpen === id &&
          <MultiSelectWrapper>
            <MultiSelectControl
              id={id}
              model={model || `.${id}`}
              title={`Update ${lowerCase(field.label)}`}
              onCancel={this.onCloseMultiselect}
              buttons={[
                field.onCreate
                ? {
                  type: 'addFromMultiselect',
                  position: 'left',
                  onClick: field.onCreate,
                }
                : null,
                {
                  type: 'closeText',
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
}

MultiSelectField.propTypes = {
  field: PropTypes.object,
  fieldData: PropTypes.object,
  handleUpdate: PropTypes.func,
};

export default MultiSelectField;

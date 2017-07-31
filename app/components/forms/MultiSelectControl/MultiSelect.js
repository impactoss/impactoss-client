import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { kebabCase } from 'lodash/string';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { getEntitySortComparator } from 'utils/sort';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';

import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import Option from './Option';


const OptionWrapper = styled.div`
  padding: 0.5em 1em;
  border-bottom: 1px solid ${palette('light', 1)};
  display: table;
  width: 100%;
`;
const ButtonGroup = styled.div`
  text-align:right;
`;
const ControlWrapper = styled.div``;
const CheckboxWrapper = styled.div`
  display: table-cell;
  vertical-align:middle;
  width: 10px;
  padding-top: 3px;
`;
const OptionLabel = styled.label`
  display: table-cell;
  vertical-align:middle;
  cursor: pointer;
`;
const ControlHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${palette('dark', 2)};
  color: ${palette('primary', 4)};
  height: 60px;
  padding: 2.25em 1em 0;
`;
const HeaderButton = styled(Button)`
  position: absolute;
  right:0;
  bottom:0;
  padding-right:;
  &:hover {
    color: ${palette('primary', 1)};
  }
`;

const ControlSearch = styled.div`
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: ${palette('primary', 4)};
  height: 55px;
  padding: 1em;
  border-left: ${palette('light', 2)};
  border-right: ${palette('light', 2)};
  background-color: ${palette('light', 0)};
`;
const Search = styled.input`
  background: ${palette('primary', 4)};
  width:100%;
  border:1px solid ${palette('light', 1)};
  color: ${palette('dark', 4)};
  padding:5px;
`;
const ControlFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid ${palette('light', 2)};
  background-color: ${palette('light', 0)};
  height: 50px;
`;
const ControlMain = styled.div`
  position: absolute;
  top: ${(props) => props.search ? '115px' : '60px'};
  bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  left: 0;
  right: 0;
  overflow-y: auto;
  padding:0;
  border-left: 1px solid ${palette('light', 2)};
  border-right: 1px solid ${palette('light', 2)};
`;

export const getChangedOptions = (options) =>
  options.filter((o) => o.get('hasChanged'));

export const getCheckedValuesFromOptions = (options, onlyChanged = false) => {
  const opts = onlyChanged ? getChangedOptions(options) : options;
  return opts.filter((o) => o.get('checked')).map((o) => o.get('value'));
};

export const getCheckedOptions = (options, onlyChanged = false) => {
  const opts = onlyChanged ? getChangedOptions(options) : options;
  return opts.filter((o) => o.get('checked'));
};

export const getUncheckedValuesFromOptions = (options, onlyChanged = false) => {
  const opts = onlyChanged ? getChangedOptions(options) : options;
  return opts.filterNot((o) => o.get('checked')).map((o) => o.get('value'));
};

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.instanceOf(List),
    values: PropTypes.instanceOf(List),
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    threeState: PropTypes.bool,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    title: PropTypes.string,
    buttons: PropTypes.array,
    search: PropTypes.bool,
  }

  static defaultProps = {
    values: new List(),
    threeState: false,
    multiple: true,
    required: false,
    search: true,
  }

  constructor() {
    super();
    this.state = {
      query: null,
    };
  }

  onSearch = (evt) => {
    if (evt && evt !== undefined) evt.stopPropagation();
    this.setState({
      query: evt.target.value,
    });
  }

  getNextValues = (checked, option) => {
    const { multiple, required, values } = this.props;

    // do not update if required and change would result in empty list
    if (!checked && required) {
      const otherCheckedValues = values.find((v) =>
        v.get('checked') && !(v.get('value') === option.get('value') && v.get('query') === option.get('query'))
      );
      if (!otherCheckedValues) {
        return values;
      }
    }

    // uncheck all others if single mode (!multiple)
    let nextValues = values;
    const existingValueIndex = values.findIndex((v) =>
      v.get('value') === option.get('value') && v.get('query') === option.get('query')
    );
    if (!multiple && checked) {
      // uncheck all other options
      nextValues = nextValues.map((value, index) =>
        existingValueIndex !== index ? value.set('checked', false).set('hasChanged', true) : value
      );
    }
    // set new value
    const newValue = option.set('checked', checked).set('hasChanged', true);
    // set current value, add if not present
    return existingValueIndex > -1 ? nextValues.set(existingValueIndex, newValue) : nextValues.push(newValue);
  }

  // getOrder = (option) => {
  //   if (typeof option.get('order') !== 'undefined') {
  //     return lowerCase(option.get('order').toString());
  //   } else if (typeof option.get('label') === 'string') {
  //     return lowerCase(option.get('label'));
  //   }
  //   return 'zzzzzzzzz';
  // }

  getOptionSortValueMapper = (option) => {
    if (option.get('order')) {
      return option.get('order');
    }
    if (option.get('reference')) {
      return option.get('reference');
    }
    return option.get('label');
  }
  getOptionSortAdditionalValueMapper = (option) => {
    if (option.get('initialChecked')) {
      return -2;
    }
    if (option.get('isIndeterminate')) {
      return -1;
    }
    if (option.get('query') === 'without') {
      return 0;
    }
    return 1;
  }
  prepareOptions = (options, values, threeState) =>
    options.map((option) => {
      const value = values.find((v) => option.get('value') === v.get('value') && option.get('query') === v.get('query'));
      return option.withMutations((o) =>
        o.set('checked', value ? value.get('checked') : false)
        .set('initialChecked', option.get('checked'))
        .set('isIndeterminate', threeState && option.get('checked') === CHECKBOX_STATES.INDETERMINATE)
      );
    });
  sortOptions = (options) => options
    .sortBy(
      (option) => this.getOptionSortValueMapper(option),
      (a, b) => getEntitySortComparator(a, b, 'asc')
    )
    .sortBy(
      (option) => this.getOptionSortAdditionalValueMapper(option),
      (a, b) => getEntitySortComparator(a, b, 'asc')
    )
  filterOptions = (options, query) => {    // filter checkboxes if needed
      // match multiple words
      // see http://stackoverflow.com/questions/5421952/how-to-match-multiple-words-in-regex
    try {
      const regex = query.split(' ').reduce((memo, str) => `${memo}(?=.*\\b${str})`, '');
      const pattern = new RegExp(regex, 'i');
      return options.filter((option) =>
        pattern.test(option.get('value'))
        || pattern.test(option.get('label'))
        || pattern.test(option.get('reference'))
        || pattern.test(option.get('search'))
      );
    } catch (e) {
      // nothing
      return options;
    }
  }

  renderCheckbox = (option, i) => {
    const checked = option.get('checked');
    // TODO consider isImmutable (need to upgrade to immutable v4)
    const isIndeterminate = option.get('isIndeterminate');
    const id = `${checked}-${i}-${kebabCase(option.get('value'))}-${kebabCase(option.get('query'))}`;
    return (
      <OptionWrapper key={id}>
        <CheckboxWrapper>
          { isIndeterminate &&
            <IndeterminateCheckbox
              id={id}
              checked={checked}
              onChange={(checkedState) => {
                this.props.onChange(this.getNextValues(checkedState, option));
              }}
            />
          }
          { !isIndeterminate &&
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={(evt) => {
                if (evt && evt !== undefined) evt.stopPropagation();
                this.props.onChange(this.getNextValues(evt.target.checked, option));
              }}
            />
          }
        </CheckboxWrapper>
        <OptionLabel htmlFor={id} >
          <Option
            bold={option.get('labelBold') || checked}
            reference={typeof option.get('reference') !== 'undefined' && option.get('reference') !== null ? option.get('reference').toString() : ''}
            label={option.get('label')}
            count={option.get('showCount') && option.get('count')}
          />
        </OptionLabel>
      </OptionWrapper>
    );
  }

  renderCancel = (onCancel) => (
    <HeaderButton onClick={onCancel} >
      <Icon name="close" />
    </HeaderButton>
  );

  renderButton = (action, i) => action.submit
    ? (
      <ButtonSubmit
        key={i}
        onClick={action.onClick && (() => action.onClick())}
        type="submit"
      >
        {action.title}
      </ButtonSubmit>
    )
    : (
      <ButtonCancel
        key={i}
        onClick={action.onClick && (() => action.onClick())}
        type="button"
      >
        {action.title}
      </ButtonCancel>
    );

  render() {
    const { options, values, threeState } = this.props;

    // prepare checkboxes
    let checkboxOptions = this.prepareOptions(options, values, threeState);

    if (this.props.search && this.state.query) {
      checkboxOptions = this.filterOptions(checkboxOptions, this.state.query);
    }

    // sort checkboxes
    checkboxOptions = this.sortOptions(checkboxOptions);

    return (
      <ControlWrapper>
        <ControlHeader>
          { this.props.title }
          { this.props.onCancel &&
            this.renderCancel(this.props.onCancel)
          }
        </ControlHeader>
        { this.props.search &&
          <ControlSearch>
            <Search id="search" onChange={this.onSearch} placeholder="Filter options" />
          </ControlSearch>
        }
        <ControlMain search={this.props.search} hasFooter={this.props.buttons}>
          {checkboxOptions && checkboxOptions.map(this.renderCheckbox)}
        </ControlMain>
        { this.props.buttons &&
          <ControlFooter>
            <ButtonGroup>
              {
                this.props.buttons.map((action, i) => (
                  this.renderButton(action, i)
                ))
              }
            </ButtonGroup>
          </ControlFooter>
        }
      </ControlWrapper>
    );
  }
}

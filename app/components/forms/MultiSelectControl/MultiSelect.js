import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { kebabCase } from 'lodash/string';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import { getEntitySortComparator } from 'utils/sort';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import Option from './Option';

import messages from './messages';

const OptionWrapper = styled.div`
  display: table-row;
  width: 100%;
`;
const ButtonGroup = styled.div`
  text-align:right;
`;
const ControlWrapper = styled.div``;
const OptionListWrapper = styled.div`
  display: table;
  width: 100%;
`;
const CheckboxWrapper = styled.div`
  display: table-cell;
  vertical-align:middle;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 0.5em;
  width: 10px;
  border-bottom: 1px solid ${palette('light', 1)};
`;
const OptionLabel = styled.label`
  display: table-cell;
  vertical-align:middle;
  cursor: pointer;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  padding-right: 1em;
  border-bottom: 1px solid ${palette('light', 1)};
`;
const OptionCount = styled.span`
  display: table-cell;
  vertical-align:top;
  color: ${palette('dark', 4)};
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-right: 1em;
  text-align: right;
  border-bottom: 1px solid ${palette('light', 1)};
`;
const ControlHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${palette('dark', 2)};
  color: ${palette('primary', 4)};
  height: ${(props) => props.search ? '115px' : '60px'};
  padding: 1em 0 1em 1em;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
`;
const HeaderButton = styled(Button)`
  position: absolute;
  right:0;
  top:0;
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
  background-color: ${palette('light', 0)};
  height: 50px;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
`;
const ControlMain = styled.div`
  position: absolute;
  top: ${(props) => props.search ? '115px' : '60px'};
  bottom: ${(props) => props.hasFooter ? '50px' : '0px'};
  left: 0;
  right: 0;
  overflow-y: auto;
  padding:0;
`;

const NoOptions = styled.div`
  padding: 1em;
  font-style: italic;
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
    // advanced: PropTypes.bool,
  }

  static defaultProps = {
    values: new List(),
    threeState: false,
    multiple: true,
    required: false,
    search: true,
    advanced: false,
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
          />
        </OptionLabel>
        { option.get('showCount') && typeof option.get('count') !== 'undefined' &&
          <OptionCount>
            {option.get('count')}
          </OptionCount>
        }
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
        <ControlHeader search={this.props.search}>
          { this.props.title }
          { this.props.onCancel &&
            this.renderCancel(this.props.onCancel)
          }
          { this.props.search &&
            <ControlSearch>
              <Search id="search" onChange={this.onSearch} placeholder="Filter options" />
            </ControlSearch>
          }
        </ControlHeader>
        <ControlMain search={this.props.search} hasFooter={this.props.buttons}>
          <OptionListWrapper>
            {checkboxOptions && checkboxOptions.map(this.renderCheckbox)}
            {checkboxOptions.size === 0 &&
              <NoOptions>
                <FormattedMessage {...messages.empty} />
              </NoOptions>
            }
          </OptionListWrapper>
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

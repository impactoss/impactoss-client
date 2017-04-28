import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { kebabCase, lowerCase } from 'lodash/string';
import styled from 'styled-components';

import PrimaryAction from 'components/basic/Button/PrimaryAction';
import SimpleAction from 'components/basic/Button/SimpleAction';

import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import Option from './Option';

const ButtonGroup = styled.div`
  text-align:right;
`;
const ControlWrapper = styled.div``;
const ControlHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #ddd;
  height: 40px;
  padding: 5px;
`;
const ControlSearch = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  background: #fff;
  height: 40px;
  padding: 5px 10px;
  border-left: 1px solid #E0E1E2;
  border-right: 1px solid #E0E1E2;
`;
const Search = styled.input`
  background:#ffffff;
  width:100%;
  border:1px solid #E0E1E2;
  color:#000;
  padding:5px;
`;
const ControlFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ddd;
  height: 50px;
`;
const ControlMain = styled.div`
  position: absolute;
  top: ${(props) => props.filter ? '80px' : '40px'};
  bottom: 50px;
  left: 0;
  right: 0;
  overflow-y: auto;
  padding:10px;
  border-left: 1px solid #E0E1E2;
  border-right: 1px solid #E0E1E2;
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

const sortValues = {
  [CHECKBOX_STATES.CHECKED]: -1,
  [CHECKBOX_STATES.INDETERMINATE]: 0,
  [CHECKBOX_STATES.UNCHECKED]: 1,
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
    filter: PropTypes.bool,
  }

  static defaultProps = {
    values: new List(),
    threeState: false,
    multiple: true,
    required: false,
    filter: true,
  }

  constructor() {
    super();
    this.state = {
      query: null,
    };
  }

  onFilter = (evt) => {
    if (evt && evt !== undefined) evt.stopPropagation();
    this.setState({
      query: evt.target.value,
    });
  }

  getOrder = (option) => {
    if (typeof option.get('order') !== 'undefined') {
      return lowerCase(option.get('order').toString());
    } else if (typeof option.get('label') === 'string') {
      return lowerCase(option.get('label'));
    }
    return 'zzzzzzzzz';
  }

  getNextValues = (checked, option) => {
    const { multiple, required, values } = this.props;

    // do not update if required and change would result in empty list
    if (!checked && required) {
      const otherCheckedValues = values.find((v) => v.get('checked') && !v.get('value') === option.get('value'));
      if (!otherCheckedValues) {
        return values;
      }
    }

    // uncheck all others if single mode (!multiple)
    let nextValues = values;
    const existingValueIndex = values.findIndex((v) => v.get('value') === option.get('value'));
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

  renderCheckbox = (option, i) => {
    const checked = option.get('checked');
    // TODO consider isImmutable (need to upgrade to immutable v4)
    const isThreeState = option.get('isThreeState');
    const id = `${checked}-${i}-${kebabCase(option.get('value'))}`;
    return (
      <div key={id}>
        { isThreeState &&
          <IndeterminateCheckbox
            id={id}
            checked={checked}
            onChange={(checkedState) => {
              this.props.onChange(this.getNextValues(checkedState, option));
            }}
          />
        }
        { !isThreeState &&
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
        <label htmlFor={id} >
          <Option
            bold={option.get('labelBold') || checked}
            reference={option.get('reference') && option.get('reference').toString()}
            label={option.get('label')}
            count={option.get('showCount') && option.get('count')}
          />
        </label>
      </div>
    );
  }

  renderCancel = (onCancel) => (
    <SimpleAction onClick={onCancel} >
      X
    </SimpleAction>
  );

  renderButton = (action, i) => {
    if (action.type === 'primary') {
      return (
        <PrimaryAction
          key={i}
          onClick={action.onClick && (() => action.onClick())}
          type={action.submit ? 'submit' : 'button'}
        >
          {action.title}
        </PrimaryAction>
      );
    }
    return (
      <SimpleAction
        key={i}
        onClick={action.onClick && (() => action.onClick())}
        type={action.submit ? 'submit' : 'button'}
      >
        {action.title}
      </SimpleAction>
    );
  }
  render() {
    const { options, values, threeState } = this.props;

    // prepare checkboxes
    let checkboxes = options.map((option) => {
      const value = values.find((v) => option.get('value') === v.get('value'));
      return option.withMutations((o) =>
        o.set('checked', value ? value.get('checked') : false)
        .set('initialChecked', option.get('checked'))
        .set('isThreeState', threeState && option.get('checked') === CHECKBOX_STATES.INDETERMINATE)
        .set('order', this.getOrder(option))
      );
    });

    // filter checkboxes if needed
    // match multiple words
    // see http://stackoverflow.com/questions/5421952/how-to-match-multiple-words-in-regex
    if (this.props.filter && this.state.query) {
      try {
        const regex = this.state.query.split(' ').reduce((memo, str) => `${memo}(?=.*\\b${str})`, '');
        const pattern = new RegExp(regex, 'i');
        checkboxes = checkboxes.filter((option) =>
          pattern.test(option.get('value'))
          || pattern.test(option.get('label'))
          || pattern.test(option.get('reference'))
          || pattern.test(option.get('search'))
        );
      } catch (e) {
        // nothing
      }
    }

    // sort checkboxes
    checkboxes = checkboxes.sort((a, b) => {
      const aSort = a.get('order');
      const bSort = b.get('order');
      // first check for 0 order
      if (aSort === '0' && aSort < bSort) return -1;
      if (bSort === '0' && bSort < aSort) return 1;
      // then check checked state
      const aSortChecked = sortValues[a.get('initialChecked')];
      const bSortChecked = sortValues[b.get('initialChecked')];
      if (aSortChecked < bSortChecked) return -1;
      if (aSortChecked > bSortChecked) return 1;
      // if same checked state, sort by order value
      if (aSort < bSort) return -1;
      if (aSort > bSort) return 1;
      return 0;
    });
    return (
      <ControlWrapper>
        <ControlHeader>
          { this.props.title &&
            <strong>{this.props.title}</strong>
          }
          { this.props.onCancel &&
            this.renderCancel(this.props.onCancel)
          }
        </ControlHeader>
        { this.props.filter &&
          <ControlSearch>
            <Search id="search" onChange={this.onFilter} placeholder="Filter options" />
          </ControlSearch>
        }
        <ControlMain filter={this.props.filter} >
          {checkboxes && checkboxes.map(this.renderCheckbox)}
        </ControlMain>
        <ControlFooter>
          { this.props.buttons &&
            <ButtonGroup>
              {
                this.props.buttons.map((action, i) => (
                  this.renderButton(action, i)
                ))
              }
            </ButtonGroup>
          }
        </ControlFooter>
      </ControlWrapper>
    );
  }
}

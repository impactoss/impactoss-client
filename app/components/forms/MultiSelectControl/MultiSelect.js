import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { kebabCase } from 'lodash/string';
import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

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
  [CHECKBOX_STATES.CHECKED]: 1,
  [CHECKBOX_STATES.INDETERMINATE]: 0,
  [CHECKBOX_STATES.UNCHECKED]: -1,
};

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.instanceOf(List),
    values: PropTypes.instanceOf(List),
    onChange: PropTypes.func.isRequired,
    threeState: PropTypes.bool,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
  }

  static defaultProps = {
    values: new List(),
    threeState: false,
    multiple: true,
    required: false,
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
    const label = option.get('label');
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
          {label}
        </label>
      </div>
    );
  }


  render() {
    const { options, values, threeState } = this.props;
    const checkboxes = options.map((option) => {
      const value = values.find((v) => option.get('value') === v.get('value'));
      const initialChecked = option.get('checked');
      const isThreeState = threeState && option.get('checked') === CHECKBOX_STATES.INDETERMINATE;
      return option.withMutations((o) =>
        o.set('checked', value ? value.get('checked') : option.get('checked'))
        .set('initialChecked', initialChecked)
        .set('isThreeState', isThreeState));
    })
    .sort((a, b) => {
      const aSort = sortValues[a.get('initialChecked')];
      const bSort = sortValues[b.get('initialChecked')];
      if (aSort > bSort) return -1;
      if (aSort < bSort) return 1;
      return 0;
    });

    return (
      <div>
        {checkboxes && checkboxes.map(this.renderCheckbox)}
      </div>
    );
  }
}

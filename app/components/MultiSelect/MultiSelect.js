import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { kebabCase } from 'lodash/string';

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.instanceOf(Immutable.List), // immutable list
    values: PropTypes.instanceOf(Immutable.List), // immutable
    onChange: PropTypes.func.isRequired,
    valueCompare: PropTypes.func,
  }

  static defaultProps = {
    values: new Immutable.List(),
    valueCompare: (a, b) => a === b,
  }

  check = (checked, value) => {
    this.props.onChange(checked
      ? this.props.values.concat([value])
      : this.props.values.filterNot((v) => this.props.valueCompare(v, value))
    );
  }

  render() {
    const { options, values, valueCompare } = this.props;
    const checkboxes = options.map((option) =>
      option.set('checked', values.some((v) => valueCompare(v, option.get('value')))));

    return (
      <div>
        {checkboxes && checkboxes.map((option, i) => {
          const value = option.get('value');
          const checked = option.get('checked');
          const label = option.get('label');
          return (
            <div key={i}>
              <input
                type="checkbox"
                onChange={(evt) => {
                  if (evt && evt !== undefined) evt.stopPropagation();
                  this.check(evt.target.checked, value);
                }}
                checked={checked}
                value={value}
                id={`${value}-${kebabCase(label)}`}
              />
              <label htmlFor={`${value}-${kebabCase(label)}`} >
                {label}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import { kebabCase } from 'lodash/string';

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired, // Todo enable component here
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
    values: PropTypes.object.isRequired, // immutable
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    values: fromJS([]),
  }

  handleClick = (evt) => {
    if (evt && evt !== undefined) evt.stopPropagation();
    this.props.onChange(evt.target.checked
      ? this.props.values.concat([evt.target.value])
      : this.props.values.filter((value) => value !== evt.target.value)
    );
  }

  render() {
    const { options, values } = this.props;
    const checkboxes = options.map((option) => ({
      ...option,
      checked: values.indexOf(option.value) > -1,
    }));

    return (
      <div>
        {checkboxes && checkboxes.map(({ value, label, checked }, i) => (
          <div key={i}>
            <input
              type="checkbox"
              onChange={this.handleClick}
              checked={checked}
              value={value}
              id={`${value}-${kebabCase(label)}`}
            />
            <label htmlFor={`${value}-${kebabCase(label)}`} >
              {label}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

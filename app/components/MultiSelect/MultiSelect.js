import React, { PropTypes } from 'react';
// import { sortBy } from 'lodash/collection';
import { without } from 'lodash/array';

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired, // Todo enable component here
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    values: [],
  }

  handleClick = (evt) => {
    if (evt && evt !== undefined) evt.stopPropagation();

    const value = evt.target.value;
    const values = this.props.values;

    if (evt.target.checked) {
      this.props.onChange(values.concat([value]));
    } else {
      this.props.onChange(without(values, value));
    }
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
              id={value}
            />
            <label htmlFor={value} >
              {label}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

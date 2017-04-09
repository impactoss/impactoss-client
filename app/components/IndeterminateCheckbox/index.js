import React, { PropTypes } from 'react';

export const STATES = {
  indeterminate: null,
  checked: true,
  unchecked: false,
};

export default class IndeterminateCheckbox extends React.Component {

  static propTypes = {
    checked: PropTypes.oneOf(Object.values(STATES)),
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  componentDidMount() {
    this.setIndeterminate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setIndeterminate();
    }
  }

  setIndeterminate = () => {
    switch (this.props.checked) {
      case STATES.checked:
        this.inputRef.checked = true;
        break;
      case STATES.unchecked:
        this.inputRef.checked = false;
        break;
      default:
        this.inputRef.indeterminate = true;
    }
  }

  render() {
    const { onChange, value, checked, ...props } = this.props;
    return (
      <input
        type="checkbox"
        ref={(ref) => { if (ref) this.inputRef = ref; }}
        checked={checked}
        onChange={(evt) => {
          if (evt && evt !== undefined) evt.preventDefault();
          switch (this.props.checked) {
            case STATES.checked:
              return onChange(STATES.indeterminate, value);
            case STATES.indeterminate:
              return onChange(STATES.unchecked, value);
            // case STATES.unchecked:
            default:
              return onChange(STATES.checked, value);
          }
        }}
        {...props}
      />
    );
  }
}

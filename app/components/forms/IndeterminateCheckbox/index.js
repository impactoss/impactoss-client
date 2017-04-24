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
    // value: PropTypes.string,
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
      case STATES.unchecked:
        this.inputRef.checked = this.props.checked;
        break;
      default:
        this.inputRef.indeterminate = true;
    }
  }

  render() {
    const { onChange, checked, ...props } = this.props;
    return (
      <input
        type="checkbox"
        ref={(ref) => { if (ref) this.inputRef = ref; }}
        checked={checked}
        onChange={(evt) => {
          if (evt && evt !== undefined) evt.preventDefault();
          switch (this.props.checked) {
            case STATES.checked:
              return onChange(STATES.unchecked);
            default: // STATES.unchecked or STATES.indeterminate
              return onChange(STATES.checked);
          }
        }}
        {...props}
      />
    );
  }
}

import React, { PropTypes } from 'react';

export const STATES = {
  INDETERMINATE: null,
  CHECKED: true,
  UNCHECKED: false,
};

export default class IndeterminateCheckbox extends React.Component {

  static propTypes = {
    checked: PropTypes.oneOf(Object.values(STATES)),
    onChange: PropTypes.func.isRequired,
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
      case STATES.CHECKED:
      case STATES.UNCHECKED:
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
            case STATES.CHECKED:
              return onChange(STATES.UNCHECKED);
            default: // STATES.UNCHECKED or STATES.INDETERMINATE
              return onChange(STATES.CHECKED);
          }
        }}
        {...props}
      />
    );
  }
}

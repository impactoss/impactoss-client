import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

export const STATES = {
  INDETERMINATE: null,
  CHECKED: true,
  UNCHECKED: false,
};

const Input = styled.input`
accent-color: ${palette('checkbox', 0)};
&:focus-visible {
  outline: 1px solid ${palette('primary', 0)};
}
`;
export default class IndeterminateCheckbox extends React.Component {
  static propTypes = {
    checked: PropTypes.oneOf(Object.values(STATES)),
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, checked, ...props } = this.props;
    /* eslint-disable no-param-reassign */
    return (
      <Input
        type="checkbox"
        ref={(ref) => { if (ref) ref.indeterminate = checked === STATES.INDETERMINATE; }}
        checked={!!checked}
        onChange={(evt) => onChange(evt.target.checked)}
        {...props}
      />
    );
    /* eslint-enable no-param-reassign */
  }
}

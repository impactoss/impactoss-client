import React from 'react';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const StyledInput = styled.input`
  background-color: ${palette('background', 0)};
  width: 100%;
  border: 1px solid ${palette('light', 1)};
  padding: 0.7em;
  border-radius: 0.5em;
`;

class InputComponent extends React.Component {
  focus = () => {
    this.input.focus();
  }

  render() {
    return (
      <StyledInput
        ref={(node) => { this.input = node; }}
        {...this.props}
      />
    );
  }
}

export default InputComponent;

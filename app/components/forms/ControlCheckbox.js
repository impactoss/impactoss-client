import React from 'react';
import styled from 'styled-components';

const StyledCheckbox = styled.input`
  margin-right: 5px;
`;

const ControlCheckbox = ({ ...props }) => <StyledCheckbox type='checkbox' checked={props.value} {...props} />;

export default ControlCheckbox;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledCheckbox = styled.input`
  margin-right: 5px;
`;

const ControlCheckbox = ({ ...props }) => <StyledCheckbox type="checkbox" checked={props.value} {...props} />;

ControlCheckbox.propTypes = {
  value: PropTypes.bool,
};

export default ControlCheckbox;

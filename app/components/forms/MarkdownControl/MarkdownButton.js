import React from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
import styled from 'styled-components';

const MDButtonWrapper = styled.span`
cursor: pointer;
min-width: 30px;
min-height: 30px;
text-align-items: center;
&:hover {
  background-color: ${({ disabled }) => disabled ? 'transparent' : palette('light', 2)};
}`;

const MarkdownButton = ({
  disabled, onClick, icon, label,
}) => (
  <MDButtonWrapper disabled={disabled} onClick={onClick}>
    {icon}
    {label}
  </MDButtonWrapper>
);


MarkdownButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.func,
  label: PropTypes.func,
};

export default MarkdownButton;

/**
 * A button
 */

import styled from 'styled-components';

const Button = styled.button`
  display: inline-block;
  padding: 4px 8px;
  cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
  font-size: ${(props) => props.small ? 0.8 : 0.9}em;
  text-align: center;
  vertical-align: middle;
  line-height: 1.25;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: none;
  border-radius: 0;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    font-size: ${(props) => props.small ? 0.9 : 1}em;
    padding: 6px 12px;
  }
`;

export default Button;

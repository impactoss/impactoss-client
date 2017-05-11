/**
 * A button
 */

import styled from 'styled-components';

const Button = styled.button`
  display: inline-block;
  padding: 6px 12px;
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  font-size:1em;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: none;
`;

export default Button;

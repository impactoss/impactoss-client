/**
 * A button
 */

import styled from 'styled-components';

const ButtonSimple = styled.button`
  display: inline-block;
  padding: 0;
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  font-size:1em;
  text-align: left;
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

export default ButtonSimple;

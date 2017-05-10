/**
 * A button
 */

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Button = styled.button`
  display: inline-block;
  padding: 6px 12px;
  cursor:pointer;
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
  color: ${palette('greyscaleDark', 3)};
  &:hover {
    color: ${palette('greyscaleDark', 2)};
  }
`;

export default Button;

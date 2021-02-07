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
  touch-action: manipulation;
  user-select: none;
  background-image: none;
  border: none;
  border-radius: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.small ? 0.9 : 1}em;
    padding: 6px 12px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

export default Button;

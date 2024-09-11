/**
 * A button
 */

import styled from 'styled-components';
import Button from '../Button';

const ButtonSimple = styled(Button)`
  padding: 0;
  text-align: left;
  white-space: nowrap;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0;
  }
`;

export default ButtonSimple;

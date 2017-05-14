import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonText = styled(Button)`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1em;
  padding: 10px 12px;
  color: ${(props) => props.primary ? palette('primary', 0) : palette('greyscaleDark', 3)};
  &:hover {
    color: ${(props) => props.primary ? palette('primary', 1) : palette('greyscaleDark', 2)};
  }
`;

export default ButtonText;

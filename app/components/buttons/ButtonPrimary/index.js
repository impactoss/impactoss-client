import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonPrimary = styled(Button)`
  color: ${palette('primary', 4)}
  background-color: ${palette('primary', 0)}
  border-radius: 999px;
  padding: 0.5em 1.75em;
  font-size: 1.25em;
  &:hover {
    color:${palette('primary', 4)}
    background-color: ${palette('primary', 1)}
  }
`;

export default ButtonPrimary;

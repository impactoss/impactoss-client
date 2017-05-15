import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonSubmit = styled(ButtonForm)`
  background-color: ${palette('primary', 0)};
  color: ${palette('primary', 4)};
  &:hover {
    background-color: ${palette('primary', 1)};
    color: ${palette('primary', 4)};
  }
`;

export default ButtonSubmit;

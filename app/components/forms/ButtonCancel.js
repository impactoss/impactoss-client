import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonCancel = styled(ButtonForm)`
  color: ${palette('greyscaleDark', 3)};
  &:hover {
    color: ${palette('primary', 1)};
  }
`;

export default ButtonCancel;

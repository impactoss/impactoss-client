import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonCancel = styled(ButtonForm)`
  color: ${palette('dark', 3)};
  &:hover {
    color: ${palette('primary', 0)};
  }
`;

export default ButtonCancel;

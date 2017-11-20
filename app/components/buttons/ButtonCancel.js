import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonCancel = styled(ButtonForm)`
  color: ${palette('buttonCancel', 3)};
  &:hover {
    color: ${palette('buttonCancelHover', 1)};
  }
`;

export default ButtonCancel;

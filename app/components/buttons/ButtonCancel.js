import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonCancel = styled(ButtonForm)`
  color: ${palette('buttonCancel', 0)};
  &:hover {
    color: ${palette('buttonCancelHover', 0)};
  }
`;

export default ButtonCancel;

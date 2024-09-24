import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonCancel = styled(ButtonForm)`
  color: ${palette('buttonCancel', 0)};
  &:hover, &:focus-visible {
    color: ${palette('buttonCancelHover', 0)};
  }
  &:focus-visible {
    outline: 2px solid  ${palette('primary', 0)};
  }
`;

export default ButtonCancel;

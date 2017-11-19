import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlatIconOnly = styled(Button)`
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
  }
`;

export default ButtonFlatIconOnly;

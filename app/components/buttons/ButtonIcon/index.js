import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonIcon = styled(Button)`
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
`;

export default ButtonIcon;

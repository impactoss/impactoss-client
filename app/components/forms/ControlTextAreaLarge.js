import styled from 'styled-components';
import { palette } from 'styled-theme';

import ControlTextArea from './ControlTextArea';

const ControlTextAreaLarge = styled(ControlTextArea)`
  min-height: 14em;
  border: 1px solid ${palette('inputBorder', 0)};
  &::placeholder {
    color: ${palette('dark', 4)};
    opacity: 1;
  }
`;

export default ControlTextAreaLarge;

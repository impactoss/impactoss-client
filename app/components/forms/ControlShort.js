import styled from 'styled-components';
import { palette } from 'styled-theme';

import ControlInput from './ControlInput';

const ControlShort = styled(ControlInput)`
  max-width: 120px;
  border: 1px solid ${palette('inputBorder', 0)};
  &::placeholder {
    color: ${palette('dark', 4)};
    opacity: 1;
  }
`;
export default ControlShort;

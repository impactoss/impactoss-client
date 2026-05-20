import styled from 'styled-components';
import { palette } from 'styled-theme';

const ControlInput = styled.input`
  background-color: ${palette('background', 0)};
  width: 100%;
  border: 1px solid ${palette('inputBorder', 0)};
  padding: 0.7em;
  border-radius: 0.5em;
  &::placeholder {
    color: ${palette('dark', 4)};
    opacity: 1;
  }
`;

export default ControlInput;

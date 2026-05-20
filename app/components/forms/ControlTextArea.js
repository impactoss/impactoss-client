import styled from 'styled-components';
import { palette } from 'styled-theme';

const ControlTextArea = styled.textarea`
  background-color: ${palette('background', 0)};
  width: 100%;
  border: 1px solid ${palette('inputBorder', 0)};
  padding: 0.7em;
  border-radius: 0.5em;
  min-height: 6em;
  color: ${palette('text', 0)};
  &::placeholder {
    color: ${palette('dark', 4)};
    opacity: 1;
  }
`;

export default ControlTextArea;

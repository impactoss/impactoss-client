import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.label`
  display: ${(props) => props.inline ? 'inline-block' : 'block'};
  position: relative;
  color: ${palette('dark', 4)};
  font-weight: 500;
  font-size: 0.85em;
`;

export default Label;

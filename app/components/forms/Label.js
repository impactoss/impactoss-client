import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.label`
  display: ${(props) => props.inline ? 'inline-block' : 'block'};
  position: relative;
  color: ${palette('text', 1)};
  font-weight: 500;
  font-size: 0.8em;
`;

export default Label;

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.div`
  color: ${palette('dark', 4)};
  font-weight: 500;
  font-size: 0.85em;
  width: 100%;
  position: relative;
`;

export default Label;

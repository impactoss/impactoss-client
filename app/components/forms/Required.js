import styled from 'styled-components';
import { palette } from 'styled-theme';

const Required = styled.span`
  color: ${palette('primary', 0)};
  font-weight: bold;
  font-size: 2em;
  padding-left: 5px;
  position: absolute;
  top: -0.25em;
`;

export default Required;

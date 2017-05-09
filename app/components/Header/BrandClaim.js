import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  font-size: 0.85em;
  padding: 2px 5px;
  color: ${palette('secondary', 0)};
  background-color: ${palette('primary', 2)};
`;

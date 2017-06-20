import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  height: 45px;
  text-align: center;
  border-top: 1px solid;
  border-bottom: 0;
  border-color: ${(props) => props.hasBorder ? palette('headerNavMain', 1) : 'transparent'};
  background-color: ${palette('headerNavMain', 0)};
`;

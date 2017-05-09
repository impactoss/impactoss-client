import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  height: 34px;
  text-align: center;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: ${(props) => props.hasBorder ? palette('secondary', 2) : 'transparent'};
`;

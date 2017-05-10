import styled from 'styled-components';
import { palette } from 'styled-theme';

const Sidebar = styled.div`
  position: absolute;
  top:0;
  width:300px;
  bottom:0;
  background-color: ${palette('primary', 4)};
  z-index:100;
`;
export default Sidebar;

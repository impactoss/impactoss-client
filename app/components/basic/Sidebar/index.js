import styled from 'styled-components';
import { palette } from 'styled-theme';

const Sidebar = styled.div`
  position: absolute;
  top:0;
  width:300px;
  bottom:0;
  background-color: ${palette('aside', 0)};
  z-index:100;
`;
export default Sidebar;

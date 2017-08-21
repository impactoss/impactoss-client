import styled from 'styled-components';
import { palette } from 'styled-theme';

const Sidebar = styled.div`
  position: absolute;
  top:0;
  width:300px;
  bottom:0;
  background-color: ${palette('aside', 0)};
  z-index:100;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
`;
export default Sidebar;

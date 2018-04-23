import styled from 'styled-components';
import { palette } from 'styled-theme';

const Sidebar = styled.div`
  position: absolute;
  top:0;
  width: ${(props) => props.responsiveSmall ? props.theme.sizes.aside.width.small : props.theme.sizes.aside.width.large}px;
  bottom:0;
  background-color: ${palette('aside', 0)};
  z-index:100;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    width: ${(props) => props.theme.sizes.aside.width.large}px;
  }
`;
export default Sidebar;

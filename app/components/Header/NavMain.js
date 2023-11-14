import styled from 'styled-components';
import { palette } from 'styled-theme';
import PrintHide from 'components/styled/PrintHide';

export default styled(PrintHide)`
  height:${(props) => props.theme.sizes.header.nav.heightMobile}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height:${(props) => props.theme.sizes.header.nav.height}px;
  }
  border-top: 1px solid;
  border-color: ${(props) => props.hasBorder ? palette('headerNavMain', 1) : 'transparent'};
  background-color: ${palette('headerNavMain', 0)};
  position: relative;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

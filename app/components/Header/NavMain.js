import styled from 'styled-components';
import { palette } from 'styled-theme';

export default styled.div`
  height:${(props) => props.theme.sizes.header.nav.height}px;
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: ${(props) => props.hasBorder ? palette('headerNavMain', 1) : 'transparent'};
  background-color: ${palette('headerNavMain', 0)};
  position: relative;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    text-align: center;
  }
`;

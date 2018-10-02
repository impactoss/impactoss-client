import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  font-weight: ${(props) => props.align ? 'normal' : 'bold'};
  display: inline-block;
  vertical-align: top;
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : palette('headerNavMainItem', 0)};
  background-color:${(props) => props.active ? palette('headerNavMainItem', 3) : palette('headerNavMainItem', 2)};
  &:hover {
    color:${(props) => props.active ? palette('headerNavMainItemHover', 1) : palette('headerNavMainItemHover', 0)};
    background-color:${(props) => props.active ? palette('headerNavMainItemHover', 3) : palette('headerNavMainItemHover', 2)};
  }

  font-size: 0.8em;
  padding: 2px ${(props) => props.theme.sizes.header.paddingLeft.mobile}px 1px;
  height: ${(props) => props.theme.sizes.header.nav.heightMobile - 1}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 0.9em;
    padding: 14px ${(props) => props.theme.sizes.header.paddingLeft.small}px;
    height: ${(props) => props.theme.sizes.header.nav.height - 1}px;
    position: ${(props) => props.align ? 'absolute' : 'static'};
    right: ${(props) => props.align === 'right' ? 0 : 'auto'};
    left: ${(props) => props.align === 'left' ? 0 : 'auto'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.1em;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: ${(props) => props.align ? props.theme.sizes.header.paddingLeft.small : 28}px;
    padding-right: ${(props) => props.align ? props.theme.sizes.header.paddingLeft.small : 28}px;
  }
`;

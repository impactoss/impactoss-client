import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  font-weight: ${(props) => props.align ? 'normal' : 'bold'};
  padding-top: 8px;
  padding-bottom: 0;
  padding-left: ${(props) => props.align ? 12 : 24}px;
  padding-right: ${(props) => props.align ? 12 : 24}px;
  position: ${(props) => props.align ? 'absolute' : 'static'};
  right: ${(props) => props.align === 'right' ? 0 : 'auto'};
  left: ${(props) => props.align === 'left' ? 0 : 'auto'};
  display: inline-block;
  height: ${(props) => (props.theme.sizes.header.nav.height - 1)}px;
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : palette('headerNavMainItem', 0)};
  background-color:${(props) => props.active ? palette('headerNavMainItem', 3) : palette('headerNavMainItem', 2)};
  &:hover {
    color:${(props) => props.active ? palette('headerNavMainItemHover', 1) : palette('headerNavMainItemHover', 0)};
    background-color:${(props) => props.active ? palette('headerNavMainItemHover', 3) : palette('headerNavMainItemHover', 2)};
  }
`;

// TODO @tmfrnz check
// height
// TODO @tmfrnz config
// padding

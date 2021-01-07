import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  display: inline-block;
  vertical-align: top;
  color: ${palette('headerNavMainItem', 0)};
  &:hover {
    color:${palette('headerNavMainItemHover', 0)};
  }
  font-size: 0.8em;
  padding: 2px ${(props) => props.theme.sizes.header.paddingLeft.mobile}px 1px;
  height: ${(props) => props.theme.sizes.header.nav.heightMobile - 1}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    min-width: 200px;
    font-size: 0.9em;
    padding: 8px ${(props) => props.theme.sizes.header.paddingLeft.small}px;
    height: ${(props) => props.theme.sizes.header.nav.height - 1}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1em;
    padding-left: ${(props) => props.theme.sizes.header.paddingLeft.large}px;
    padding-right: ${(props) => props.theme.sizes.header.paddingLeft.large}px;
  }
`;

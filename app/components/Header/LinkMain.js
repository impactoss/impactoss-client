import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  display: inline-block;
  vertical-align: top;
  color: ${({ active }) => active ? palette('text', 2) : palette('dark', 3)};
  background:  ${({ active }) => active ? palette('primary', 0) : 'transparent'};
  &:hover {
    color:${({ active }) => active ? palette('text', 2) : palette('headerNavMainItemHover', 0)};
  }
  font-size: 0.8em;
  padding: 2px ${(props) => props.theme.sizes.header.paddingLeft.mobile}px 1px;
  height: ${(props) => props.theme.sizes.header.nav.heightMobile - 1}px;
  border-left: 1px solid;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    min-width: 120px;
    font-size: 0.9em;
    padding: 5px ${(props) => props.theme.sizes.header.paddingLeft.small}px;
    height: ${(props) => props.theme.sizes.header.nav.height - 1}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: 160px;
    padding-top: 4px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    min-width: 200px;
    font-size: 1em;
    padding-top: 4px;
    padding-left: ${(props) => props.theme.sizes.header.paddingLeft.large}px;
    padding-right: ${(props) => props.theme.sizes.header.paddingLeft.large}px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

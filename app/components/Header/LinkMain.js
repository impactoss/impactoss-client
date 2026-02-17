import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  display: inline-block;
  vertical-align: top;
  color: ${({ active }) => active ? palette('text', 2) : palette('text', 0)};
  background:  ${({ active }) => active ? palette('primary', 0) : 'transparent'};
  &:hover, &:focus-visible {
    color: ${({ active }) => active ? palette('text', 2) : palette('headerNavMainItemHover', 0)};
    background:  ${({ active }) => active ? palette('primary', 0) : palette('light', 0)};
  }
  &:focus-visible {
    background:  ${({ active }) => active ? palette('primary', 1) : palette('light', 0)};
  }
  font-size: 0.8em;
  padding: ${(props) => props.theme.sizes.header.mainNavItem.padding.mobile};
  height: ${(props) => props.theme.sizes.header.nav.heightMobile - 1}px;
  border-left: 1px solid ${({ active }) => active ? palette('primary', 0) : palette('text', 0)};
  /* &:first-child {
    border-left-width: 0;
  } */
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    min-width: 120px;
    font-size: 0.9em;
    padding: ${(props) => props.theme.sizes.header.mainNavItem.padding.small};
    height: ${(props) => props.theme.sizes.header.nav.height}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: ${(props) => props.theme.sizes.header.mainNavItem.padding.medium};
    min-width: 180px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    min-width: 200px;
    font-size: 1em;
    padding: ${(props) => props.theme.sizes.header.mainNavItem.padding.large};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  font-size: 1em;
  display: block;
  border-bottom: 1px solid #fff;
  border-color: ${palette('header', 0)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    border-bottom: none;
    padding-top: 0.4em;
    padding-bottom: 0.4em;
    font-size: 0.8em;
    display: inline-flex;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 0.9em;
  }
`;

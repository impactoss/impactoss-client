import styled from 'styled-components';
import { palette } from 'styled-theme';

import LinkSecondary from './LinkSecondary';

export default styled(LinkSecondary)`
  color:${(props) => props.active ? palette('headerNavPagesItem', 1) : palette('headerNavPagesItem', 0)};
  background-color: transparent;  
  &:hover {
    text-decoration: ${(props) => props.active ? 'none' : 'underline'};
  }
  &:focus-visible {
    text-decoration: underline;
  }
  &:hover, &:focus-visible {
    color:${(props) => props.active ? palette('headerNavPagesItemHover', 1) : palette('headerNavPagesItemHover', 0)};
  }
`;

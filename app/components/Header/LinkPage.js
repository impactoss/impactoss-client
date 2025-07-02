import styled from 'styled-components';
import { palette } from 'styled-theme';

import LinkSecondary from './LinkSecondary';

export default styled(LinkSecondary)`
  color: ${(props) => props.active ? palette('headerNavPagesItem', 1) : palette('headerNavPagesItem', 0)};
  background-color: ${(props) => props.active ? palette('headerNavPagesItem', 3) : palette('headerNavPagesItem', 2)};
  &:hover {
    text-decoration: ${(props) => props.active ? 'underline' : 'underline'};
  }
  &:focus-visible {
    text-decoration: underline;
  }
  &:hover, &:focus-visible {
    color:${(props) => props.active ? palette('headerNavPagesItemHover', 1) : palette('headerNavPagesItemHover', 0)};
    background-color: ${(props) => props.active ? palette('headerNavPagesItemHover', 3) : palette('headerNavPagesItemHover', 2)};
  }
`;

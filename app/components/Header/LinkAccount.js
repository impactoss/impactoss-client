import styled from 'styled-components';
import { palette } from 'styled-theme';

import LinkSecondary from './LinkSecondary';

export default styled(LinkSecondary)`
  color: ${(props) => props.active ? palette('headerNavAccountItem', 1) : palette('headerNavAccountItem', 0)};
  background-color: ${(props) => props.active ? palette('headerNavAccountItem', 3) : palette('headerNavAccountItem', 2)};
  &:hover, &:focus-visible {
    background-color: ${(props) => props.active ? palette('headerNavAccountItemHover', 3) : palette('headerNavAccountItemHover', 2)};
    color: ${(props) => props.active ? palette('headerNavAccountItemHover', 1) : palette('headerNavAccountItemHover', 0)};
    text-decoration: ${(props) => props.active ? 'none' : 'underline'};
  }
`;

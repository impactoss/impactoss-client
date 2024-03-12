import styled from 'styled-components';
import { palette } from 'styled-theme';

import LinkSecondary from './LinkSecondary';

export default styled(LinkSecondary)`
  color:${(props) => props.active ? palette('headerNavPagesItem', 1) : palette('headerNavPagesItem', 0)};
  background-color: transparent;
  &:hover {
    color:${(props) => props.active ? palette('headerNavPagesItemHover', 1) : palette('headerNavPagesItemHover', 0)};
    text-decoration: ${(props) => props.active ? 'none' : 'underline'};
  }
`;

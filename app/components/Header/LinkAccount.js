import styled from 'styled-components';
import { palette } from 'styled-theme';

import LinkSecondary from './LinkSecondary';

export default styled(LinkSecondary)`
  color: ${(props) => props.active ? palette('headerNavAccountItem', 1) : palette('headerNavAccountItem', 0)};
  background-color: ${(props) => props.active ? palette('headerNavAccountItem', 3) : palette('headerNavAccountItem', 2)};
  &:hover {
    color: ${(props) => props.active ? palette('headerNavAccountItemHover', 1) : palette('headerNavAccountItemHover', 0)};
    background-color: ${(props) => props.active ? palette('headerNavAccountItemHover', 3) : palette('headerNavAccountItemHover', 2)};
  }

  border-right: 1px solid ${palette('headerNavAccountItem', 4)};
  &:hover {
    border-right: 1px solid ${palette('headerNavAccountItemHover', 4)};
  }

  &:last-child {
    border-right: none;
    &:hover {
      border-right: none;
    }
  }
`;

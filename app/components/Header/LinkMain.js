import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  font-weight: bold;
  padding: 8px 24px 0;
  height: 42px;
  color:${(props) => props.active ? palette('headerNavMainItem', 1) : palette('headerNavMainItem', 0)};
  background-color:${(props) => props.active ? palette('headerNavMainItem', 3) : palette('headerNavMainItem', 2)};
  &:hover {
    color:${(props) => props.active ? palette('headerNavMainItemHover', 1) : palette('headerNavMainItemHover', 0)};
    background-color:${(props) => props.active ? palette('headerNavMainItemHover', 3) : palette('headerNavMainItemHover', 2)};
  }
`;

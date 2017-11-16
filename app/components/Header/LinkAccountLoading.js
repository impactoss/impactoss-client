import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  cursor: default;
  color: ${palette('headerNavAccountItem', 0)};
  background-color: ${palette('headerNavAccountItem', 2)};
  border-right: 1px solid ${palette('headerNavAccountItem', 4)};

  &:last-child {
    border-right: none;
  }
`;

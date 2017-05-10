import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  color:${palette('primary', 4)};
  background-color:${palette('primary', 1)};

  &:hover {
    background-color:${palette('primary', 0)};
    color:${palette('primary', 4)};
  }
  &:first-child {
    border-right: 1px solid ${palette('primary', 0)};
  }
`;

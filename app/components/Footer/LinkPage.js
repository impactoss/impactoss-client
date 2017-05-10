import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  color:${palette('primary', 4)};

  &:hover {
    color:${palette('primary', 4)};
    opacity: 0.9;
  }
`;

/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';
import { palette } from 'styled-theme';

const A = styled.a`
  color: ${palette('primary', 0)};

  &:hover {
    color: ${palette('primary', 1)};
  }
`;

export default A;

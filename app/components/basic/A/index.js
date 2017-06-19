/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';
import { palette } from 'styled-theme';

const A = styled.a`
  color: ${palette('linkDefault', 0)};

  &:hover {
    color: ${palette('linkDefaultHover', 0)};
  }
`;

export default A;

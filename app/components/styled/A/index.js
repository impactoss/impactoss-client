/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';
import { palette } from 'styled-theme';

const A = styled.a`
  color: ${palette('link', 0)};

  &:hover {
    color: ${palette('linkHover', 0)};
  }
`;

export default A;

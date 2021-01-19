/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';
import { palette } from 'styled-theme';

const A = styled.a`
  color: ${(props) => props.isOnLightBackground ? palette('link', 1) : palette('link', 0)};

  &:hover {
    color: ${(props) => props.isOnLightBackground ? palette('linkHover', 1) : palette('linkHover', 0)};
  }
`;

export default A;

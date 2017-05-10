import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  font-weight: bold;
  padding: 0.5em 1.5em;
  color: ${(props) => props.active ? palette('primary', 1) : palette('greyscaleLight', 2)};

  &:hover {
    color: ${palette('primary', 0)};
  }
`;

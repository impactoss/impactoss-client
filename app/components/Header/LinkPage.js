import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  color:${(props) => props.active ? palette('greyscaleLight', 2) : palette('greyscaleLight', 3)};

  &:hover {
    color:${palette('primary', 4)};
  }
`;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  color:${(props) => props.active ? palette('light', 2) : palette('light', 3)};

  &:hover {
    color:${palette('primary', 4)};
  }
`;

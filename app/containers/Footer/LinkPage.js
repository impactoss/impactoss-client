import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from './Link';

export default styled(Link)`
  color:${palette('footerLinks', 0)};

  &:hover {
    color:${palette('footerLinksHover', 0)};    
  }
`;

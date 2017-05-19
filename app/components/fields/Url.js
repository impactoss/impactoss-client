import styled from 'styled-components';
import { palette } from 'styled-theme';

import A from 'components/basic/A';

const Url = styled(A)`
  color: ${palette('greyscaleDark', 1)}
  font-weight: bold;
  font-size: 0.85em;
`;

export default Url;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import ListLabel from './ListLabel';

const LabelLarge = styled(ListLabel)`
  padding-bottom: 0.85em;
  border-bottom: none;
  font-size: 1.8em;
  color: ${palette('dark', 0)};
`;

export default LabelLarge;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Label from './Label';

const ListLabel = styled(Label)`
  display: table-cell;
  vertical-align: middle;
  font-size: 1.1em;
  color: ${palette('text', 0)};
`;

export default ListLabel;

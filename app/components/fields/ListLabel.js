import styled from 'styled-components';
import { palette } from 'styled-theme';

import Label from './Label';

const ListLabel = styled(Label)`
  padding-bottom: 8px;
  border-bottom: 1px solid ${palette('light', 0)};
`;

export default ListLabel;

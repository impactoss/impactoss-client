import styled from 'styled-components';
import { palette } from 'styled-theme';

import FieldIcon from './FieldIcon';

const ListItemIcon = styled(FieldIcon)`
  top: 0.5em;
  color: ${palette('light', 4)}
`;

export default ListItemIcon;

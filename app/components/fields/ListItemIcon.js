import styled from 'styled-components';
import { palette } from 'styled-theme';

import FieldIcon from './FieldIcon';

const ListItemIcon = styled(FieldIcon)`
  top: 0.5em;
  color: ${palette('dark', 1)}
`;

export default ListItemIcon;

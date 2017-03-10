import styled from 'styled-components';
import { palette } from 'styled-theme';

import SimpleAction from '../SimpleAction';

const PrimaryAction = styled(SimpleAction)`
  color:${palette('danger', 2)}
`;

export default PrimaryAction;

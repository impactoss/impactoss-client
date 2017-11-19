import styled from 'styled-components';
import { palette } from 'styled-theme';

import Reference from 'components/fields/Reference';

const ReferenceLarge = styled(Reference)`
  font-size: 2em;
  font-weight: bold;
  color: ${palette('dark', 3)}
`;


export default ReferenceLarge;

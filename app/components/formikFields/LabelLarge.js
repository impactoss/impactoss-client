import styled from 'styled-components';
import { palette } from 'styled-theme';

import Label from './Label';

const LabelLarge = styled(Label)`
  font-size: 1.8em;
  color: ${palette('text', 0)};
  padding-bottom: 0.85em;
  border-bottom: none;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.larger};
  }
`;

export default LabelLarge;

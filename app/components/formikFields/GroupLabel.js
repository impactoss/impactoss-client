import styled from 'styled-components';

import Label from './Label';

const GroupLabel = styled(Label)`
  display: table-cell;
  vertical-align: middle;
  font-size: 1em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

export default GroupLabel;

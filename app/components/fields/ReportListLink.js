import styled from 'styled-components';
import { palette } from 'styled-theme';

import ListLink from './ListLink';

const ReportListLink = styled(ListLink)`
  font-weight: 500;
  font-size: 1.2em;
  color: ${palette('dark', 1)};
  display: block;
`;


export default ReportListLink;

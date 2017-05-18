
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ListItem from './ListItem';

const ReportListItem = styled(ListItem)`
  padding: 1.25em 0;
  border-top: 1px solid ${palette('greyscaleLight', 0)};
  position: relative;
`;

export default ReportListItem;

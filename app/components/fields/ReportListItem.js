
import styled from 'styled-components';

import ListItem from './ListItem';

const ReportListItem = styled(ListItem)`
  padding: 0px 12px 6px 0;
  font-weight: normal;
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.mainListItem};
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
`;

export default ReportListItem;

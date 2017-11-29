import styled from 'styled-components';
import { palette } from 'styled-theme';

const ReportListItem = styled.div`
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
  border-top: 1px solid ${palette('light', 0)};
`;


export default ReportListItem;

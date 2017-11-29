import styled from 'styled-components';
import { palette } from 'styled-theme';

import ListLink from './ListLink';

const ReportListLink = styled(ListLink)`
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  }
  display: block;
  border-top: 1px solid ${palette('light', 0)};
`;


export default ReportListLink;

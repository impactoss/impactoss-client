
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';

const ReportListTitleLink = styled(Link)`
  text-decoration: none;
  display: block;
  padding: 0px 12px 6px 0;
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  }
`;

export default ReportListTitleLink;

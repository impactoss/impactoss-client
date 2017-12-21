import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';
const ListLink = styled(Link)`
  color: ${palette('mainListItem', 0)};
  display: block;
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  }
`;

export default ListLink;

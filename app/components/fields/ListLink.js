import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';
const ListLink = styled(Link)`
  font-size: 1.2em;
  color: ${palette('mainListItem', 0)};
  &:hover {
    color: ${palette('mainListItemHover', 0)};
  display: block;
`;

export default ListLink;

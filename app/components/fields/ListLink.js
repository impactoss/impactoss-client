import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';
const ListLink = styled(Link)`
  font-weight: bold;
  font-size: 1.2em;
  color: ${palette('greyscaleDark', 1)};
  display: block;
`;

export default ListLink;

import { Link } from 'react-router';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const EntityListItemMainTitle = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  display: block;
  padding: 3px 0 8px;
  font-size: 1.1em;
  color: ${palette('greyscaleDark', 0)};
  &:hover {
    color: ${palette('greyscaleDark', 2)};
  }
`;

export default EntityListItemMainTitle;

import { Link } from 'react-router';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const EntityListItemMainTopReference = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  display: block;
  float:left;
  color: ${palette('greyscaleDark', 4)};
  &:hover {
    color: ${palette('greyscaleDark', 2)};
  }
`;

export default EntityListItemMainTopReference;

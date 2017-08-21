import styled from 'styled-components';
import { palette } from 'styled-theme';

const EntityListItemMainTopReference = styled.a`
  font-weight: 500;
  text-decoration: none;
  display: block;
  float:left;
  color: ${palette('dark', 4)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;

export default EntityListItemMainTopReference;

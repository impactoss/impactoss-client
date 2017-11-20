import styled from 'styled-components';
import { palette } from 'styled-theme';

const EntityListItemMainTopReference = styled.a`
  text-decoration: none;
  display: block;
  float: left;
  color: ${palette('text', 1)};
  &:hover {
    color: ${palette('text', 0)};
  }
  font-size: 0.85em; 
`;

export default EntityListItemMainTopReference;

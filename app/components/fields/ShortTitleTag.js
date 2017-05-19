import styled from 'styled-components';
import { palette } from 'styled-theme';

const ShortTitleTag = styled.span`
  display: inline-block;
  color: ${palette('primary', 4)};
  background-color: ${(props) => palette('taxonomies', parseInt(props.pIndex, 10) || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
`;

export default ShortTitleTag;

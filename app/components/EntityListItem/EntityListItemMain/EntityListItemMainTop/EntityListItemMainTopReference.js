import styled from 'styled-components';
import { palette } from 'styled-theme';

const EntityListItemMainTopReference = styled.div`
  text-decoration: none;
  display: block;
  float: left;
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemTop};
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
`;

export default EntityListItemMainTopReference;

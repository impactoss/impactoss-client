import styled from 'styled-components';

const ListItem = styled.div`
  padding: 10px 0 3px;
  line-height: ${(props) => props.theme.sizes.lineHeights.mainListItem};
`;

export default ListItem;

import styled from 'styled-components';

const ListInlineItem = styled.div`
  width: ${(props) => props.itemWidth}%;
  display: table-cell;
  text-align: center;
  padding: 0 2px;
`;

export default ListInlineItem;

import styled from 'styled-components';
import { palette } from 'styled-theme';

const ListLabel = styled.div`
  display: table-cell;
  vertical-align: middle;
  font-weight: 500;
  color: ${palette('text', 0)};
  width: 100%;
`;

export default ListLabel;

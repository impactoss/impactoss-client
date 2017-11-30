import styled from 'styled-components';
import { palette } from 'styled-theme';

const ListLabelWrap = styled.div`
  display: table;
  padding-bottom: 5px;
  border-bottom: 1px solid ${palette('light', 0)};
  width: 100%;
`;

export default ListLabelWrap;

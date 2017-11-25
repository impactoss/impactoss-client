import styled from 'styled-components';
import { palette } from 'styled-theme';

const ColumnHeader = styled.div`
  width:${(props) => props.width * 100}%;
  position: relative;
  display: table-cell;
  padding: 4px 1em;
  min-height: 35px;
  border-right: 1px solid ${palette('light', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;
export default ColumnHeader;

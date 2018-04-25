import styled from 'styled-components';
import { palette } from 'styled-theme';

const ColumnHeader = styled.div`
  width:${(props) => props.width * 100}%;
  position: relative;
  display: table-cell;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 4px;
  min-height: 35px;
  border-right: 1px solid ${palette('light', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;
export default ColumnHeader;

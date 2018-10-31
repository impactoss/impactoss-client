import styled from 'styled-components';
import { palette } from 'styled-theme';

const ColumnHeader = styled.div`
  font-size: 0.75em;
  padding: 4px;
  overflow: hidden;
  word-break: break-word;
  overflow: hidden;
  width:${(props) => props.width * 100}%;
  position: relative;
  display: table-cell;
  min-height: 35px;
  border-right: 1px solid ${palette('light', 2)};
  &:last-child {
    border-right: none;
  }
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 4px;
  }
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.medium : '993px'}) {
    font-size: 0.85em;
  }
`;
export default ColumnHeader;

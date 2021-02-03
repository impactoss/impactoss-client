import styled from 'styled-components';
import { palette } from 'styled-theme';

const ColumnHeader = styled.div`
  font-size: 0.75em;
  padding: 4px;
  word-break: break-word;
  width: ${(props) => props.colWidth}%;
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
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
    position: relative;
    z-index: 0;
    height: 30px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      border-bottom: 30px solid ${palette('light', 1)};
    }
  }
`;
export default ColumnHeader;

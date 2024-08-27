import styled from 'styled-components';
import { palette } from 'styled-theme';

const ShortTitleTag = styled.span`
  display: inline-block;
  color: ${({ pIndex }) => palette('taxonomiesTextColor', pIndex)}};
  background-color: ${({ pIndex }) => palette('taxonomies', pIndex || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid ${({ pIndex }) => palette('taxonomies', pIndex || 0)};
  line-height: normal;
  @media print {
    padding: 0 4px;
    font-size: ${(props) => props.theme.sizes.print.smallest};
    line-height: 10pt;
    color: ${palette('text', 1)};
    background-color: transparent;
    margin-right: 8px;
    border-radius: 3px;
    border-right: 1px solid;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-left: 7px solid;
    border-color: ${(props) => palette('taxonomies', parseInt(props.pIndex, 10) || 0)};
  }
`;

export default ShortTitleTag;

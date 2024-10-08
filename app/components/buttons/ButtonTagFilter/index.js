import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

function getTextColor(pIndex) {
  if (pIndex === 6 || pIndex === 7) {
    return palette('dark', 0);
  }
  return palette('text', 2);
}
const ButtonTagFilter = styled(Button)`
  color: ${({ pIndex }) => getTextColor(pIndex)};
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  padding: 1px 6px;
  margin: 1px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid ${(props) => palette(props.palette, props.pIndex || 0)};

  &:hover, &:focus-visible {
    color: ${({ pIndex }) => getTextColor(pIndex)};
    background-color: ${(props) => palette(props.disabled ? props.palette : props.paletteHover, props.pIndex || 0)};
  }
  &:focus-visible {
    outline: 1px solid ${(props) => palette(props.disabled ? props.palette : props.paletteHover, props.pIndex || 0)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 1px 6px;
    font-size: 0.85em;
  }
  @media print {
    color: ${palette('text', 1)};
    background: transparent;
    border-radius: 3px;
    border-right: 1px solid;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-left: 7px solid;
    border-color: ${(props) => palette(props.palette, props.pIndex || 0)};
    padding: 0 4px;
    font-size: ${(props) => props.theme.sizes.print.smallest};
    line-height: 10pt;
    &:hover {
      color: ${palette('text', 1)};
      background: transparent;
    }
  }
`;

export default ButtonTagFilter;

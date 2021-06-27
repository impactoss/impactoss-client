import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonTagFilter = styled(Button)`
  color: ${palette('text', 2)};
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid ${(props) => palette(props.palette, props.pIndex || 0)};
  &:hover {
    color: ${palette('text', 2)};
    background-color: ${(props) => palette(props.disabled ? props.paletteHover : props.palette, props.pIndex || 0)};
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

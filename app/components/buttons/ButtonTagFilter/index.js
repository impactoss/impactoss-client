import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonTagFilter = styled(Button)`
  color: ${palette('primary', 4)};
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  line-height: 1.25em;
  &:hover {
    color: ${palette('primary', 4)};
    background-color: ${(props) => palette(props.disabled ? props.paletteHover : props.palette, props.pIndex || 0)};
  }
`;

export default ButtonTagFilter;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFilterTag = styled(Button)`
  color: ${palette('primary', 4)};
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  &:hover {
    color: ${palette('primary', 4)};
    background-color: ${(props) => palette(props.paletteHover, props.pIndex || 0)};
  }
`;

export default ButtonFilterTag;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFilterTagInverse = styled(Button)`
  color: ${(props) => palette(props.palette, props.pIndex || 0)};
  background-color: ${palette('primary', 4)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid;
  &:hover {
    color: ${(props) => palette(props.paletteHover, props.pIndex || 0)};
    background-color: ${palette('greyscaleLight', 0)};
  }
`;

export default ButtonFilterTagInverse;

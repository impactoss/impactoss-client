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
  line-height: 1.25em;
  border: 1px solid ${(props) => palette(props.palette, props.pIndex || 0)};
  &:hover {
    color: ${palette('text', 2)};
    background-color: ${(props) => palette(props.disabled ? props.paletteHover : props.palette, props.pIndex || 0)};
  }
`;

export default ButtonTagFilter;

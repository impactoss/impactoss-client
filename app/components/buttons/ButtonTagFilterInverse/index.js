import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonTagFilter from '../ButtonTagFilter';

const ButtonTagFilterInverse = styled(ButtonTagFilter)`
  color: ${(props) => palette(props.palette, props.pIndex || 0)};
  background-color: ${palette('buttonInverse', 1)};
  padding: 1px 6px;
  border: 1px solid;
  border-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  &:hover {
    color: ${(props) => palette(props.paletteHover, props.pIndex || 0)};
    background-color: ${palette('buttonInverseHover', 1)};
  }
`;

export default ButtonTagFilterInverse;

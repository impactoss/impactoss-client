import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlatIconOnly = styled(Button)`
  color: ${({ subtle }) => (subtle ? palette('text', 1) : palette('buttonFlat', 0))};
  &:hover, &:focus-visible {
    color: ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))};
  }
  &:focus-visible {
    outline: 2px solid ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))};
    outline-offset: 0px;
    border-radius: 2px;
  }
`;

export default ButtonFlatIconOnly;

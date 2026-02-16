import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlatIconOnly = styled(Button)`
  color: ${({ subtle }) => (subtle ? palette('text', 1) : palette('buttonFlat', 0))};
  stroke: ${({ subtle }) => (subtle ? palette('text', 1) : palette('buttonFlat', 0))};
  border-radius: 999px;
  padding: 6px;
  min-width: 30px;
  min-height: 30px;
  &:hover, &:focus-visible {
    color: ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlat', 0))};
    stroke: ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))};
    background-color: ${palette('light', 2)};
  }
  &:focus-visible {
    outline: 1px solid ${({ subtle }) => (subtle ? palette('buttonFlat', 0) : palette('buttonFlatHover', 0))};
    outline-offset: 2px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 6px;
    min-width: 36px;
    min-height: 36px;
  }
  @media print {
    display: none;
  }
`;

export default ButtonFlatIconOnly;

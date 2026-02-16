import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonDefault from '../ButtonDefault';

const ButtonDefaultIconOnly = styled(ButtonDefault)`
  padding: 0;
  color: ${palette('buttonDefaultIconOnly', 0)};
  background-color: ${palette('buttonDefaultIconOnly', 1)};
  /* &:active {
    border: 2px solid ${palette('buttonDefaultIconOnly', 2)};
  } */
  &:hover, &:focus-visible {
    color: ${palette('buttonDefaultIconOnlyHover', 0)};
    background-color: ${palette('buttonDefaultIconOnlyHover', 1)};
    border-color: ${palette('buttonDefaultIconOnlyHover', 2)};
  }
  &:focus-visible {
    outline: 2px solid  ${palette('buttonDefaultIconOnlyHover', 1)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0;
    border-width: 4px;
  }
`;

export default ButtonDefaultIconOnly;

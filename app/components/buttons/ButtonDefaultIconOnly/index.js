import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonDefault from '../ButtonDefault';

const ButtonDefaultIconOnly = styled(ButtonDefault)`
  padding: 0.5em;
  color: ${palette('buttonDefaultIconOnly', 0)};
  background-color: ${palette('buttonDefaultIconOnly', 1)};
  border: 2px solid ${palette('buttonDefaultIconOnly', 2)};
  &:hover {
    color: ${palette('buttonDefaultIconOnlyHover', 0)};
    background-color: ${palette('buttonDefaultIconOnlyHover', 1)};
    border-color: ${palette('buttonDefaultIconOnlyHover', 2)};
  }
`;

export default ButtonDefaultIconOnly;

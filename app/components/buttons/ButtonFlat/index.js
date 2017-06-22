import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlat = styled(Button)`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1em;
  padding: 10px 12px;
  color: ${(props) => props.primary ? palette('buttonFlat', 0) : palette('buttonFlat', 1)};
  &:hover {
    color: ${(props) => props.primary ? palette('buttonFlatHover', 0) : palette('buttonFlatHover', 1)};
  }
`;

export default ButtonFlat;

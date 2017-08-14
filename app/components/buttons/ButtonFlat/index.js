import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlat = styled(Button)`
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${(props) => props.form ? '1em 1.2em' : '10px 12px'};
  color: ${(props) => {
    if (props.disabled) {
      return palette('buttonFlat', 2);
    }
    return props.primary ? palette('buttonFlat', 0) : palette('buttonFlat', 1);
  }};
  &:hover {
    color: ${(props) => {
      if (props.disabled) {
        return palette('buttonFlat', 2);
      }
      return props.primary ? palette('buttonFlatHover', 0) : palette('buttonFlatHover', 1);
    }};
  }
`;

export default ButtonFlat;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const ButtonFlat = styled(Button)`
  letter-spacing: 0.5px;
  font-weight: bold;
  text-transform: uppercase;
  padding: ${(props) => props.form ? '1em 0.6em' : '10px 5px'};
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
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    letter-spacing: 1px;
    padding: ${(props) => props.form ? '1em 1.2em' : '10px 12px'};
  }
`;

export default ButtonFlat;

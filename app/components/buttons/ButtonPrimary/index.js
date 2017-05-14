import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const getActiveHoverBackground = (disabled) => disabled ? palette('primary', 0) : palette('primary', 1);
const getInactiveHoverBackground = (disabled) => disabled ? palette('greyscaleLight', 1) : palette('primary', 4);

// eslint-disable no-nested-ternary
const ButtonPrimary = styled(Button)`
  color: ${(props) => props.inactive
    ? palette('greyscaleDark', 1)
    : palette('primary', 4)
  };
  background-color: ${(props) => props.inactive
    ? palette('greyscaleLight', 1)
    : palette('primary', 0)
  };
  border-radius: 999px;
  padding: 0.5em 1.75em;
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  &:hover {
    color: ${(props) => props.inactive
      ? palette('greyscaleDark', 1)
      : palette('primary', 4)
    };
    background-color: ${(props) => props.inactive
      ? getInactiveHoverBackground(props.disabled)
      : getActiveHoverBackground(props.disabled)
    };
  }
`;

export default ButtonPrimary;

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const getInactiveHoverBackground = (disabled) => disabled
  ? palette('buttonToggleInactive', 1)
  : palette('buttonToggleInactiveHover', 1);

const getActiveHoverBackground = (disabled) => disabled
  ? palette('buttonDefault', 1)
  : palette('buttonDefaultHover', 1);

// eslint-disable no-nested-ternary
const ButtonDefault = styled(Button)`
  letter-spacing: 1px;
  color: ${(props) => props.inactive
    ? palette('buttonToggleInactive', 0)
    : palette('buttonDefault', 0)
  };
  background-color: ${(props) => props.inactive
    ? palette('buttonToggleInactive', 1)
    : palette('buttonDefault', 1)
  };
  box-shadow: ${(props) => {
    if (props.outline) {
      const color = props.inactive
        ? props.theme.palette.buttonToggleInactive[1]
        : props.theme.palette.buttonDefault[1];
      return `0 0 0 2px ${color}`;
    }
    return 'none';
  }};
  border-radius: 999px;
  padding: 0.5em 1.75em;
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  &:hover {
    color: ${(props) => props.inactive
      ? palette('buttonToggleInactiveHover', 0)
      : palette('buttonDefaultHover', 0)
    };
    background-color: ${(props) => props.inactive
      ? getInactiveHoverBackground(props.disabled)
      : getActiveHoverBackground(props.disabled)
    };
    box-shadow: ${(props) => {
      if (props.outline) {
        const color = props.inactive
          ? props.theme.palette.buttonToggleInactiveHover[1]
          : props.theme.palette.buttonDefaultHover[1];
        return `0 0 0 2px ${color}`;
      }
      return 'none';
    }};
  }
`;

export default ButtonDefault;

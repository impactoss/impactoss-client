import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonSubmit = styled(ButtonForm)`
  color: ${(props) =>
    props.disabled
    ? palette('buttonDefaultDisabled', 0)
    : palette('buttonDefault', 0)
  };
  background-color: ${(props) =>
    props.disabled
    ? palette('buttonDefaultDisabled', 1)
    : palette('buttonDefault', 1)
  };
  &:hover {
    background-color: ${(props) =>
      props.disabled
      ? palette('buttonDefaultDisabled', 1)
      : palette('buttonDefaultHover', 1)
    };
    color: ${(props) =>
      props.disabled
      ? palette('buttonDefaultDisabled', 0)
      : palette('buttonDefaultHover', 0)
    };
  }
`;

export default ButtonSubmit;

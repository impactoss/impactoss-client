import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonForm from './ButtonForm';

const ButtonSubmit = styled(ButtonForm)`
  color: ${palette('primary', 4)};
  background-color: ${(props) =>
    props.disabled
    ? palette('light', 3)
    : palette('primary', 1)
  };
  &:hover {
    background-color: ${(props) =>
      props.disabled
      ? palette('light', 3)
      : palette('primary', 0)
    };
    color: ${palette('primary', 4)};
  }
`;

export default ButtonSubmit;

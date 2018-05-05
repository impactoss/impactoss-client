import styled from 'styled-components';

import Button from 'components/buttons/Button';

const ButtonForm = styled(Button)`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9em;
  padding: 0.7em 0.5em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    letter-spacing: 1px;
    font-size: 1em;
    padding: 1em 1.2em;
  }
`;

export default ButtonForm;

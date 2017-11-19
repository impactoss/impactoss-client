import styled from 'styled-components';
import { palette } from 'styled-theme';
import ButtonDefault from '../ButtonDefault';

const ButtonHero = styled(ButtonDefault)`
  font-size: 1.25em;
  padding: 0.8em;
  min-width: 200px;
  background-color: ${palette('primary', 1)};
  &:hover {
    background-color: ${palette('primary', 0)};
  }
`;

export default ButtonHero;

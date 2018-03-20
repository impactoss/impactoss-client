import styled from 'styled-components';
import { palette } from 'styled-theme';
import ButtonDefault from '../ButtonDefault';

const ButtonHero = styled(ButtonDefault)`
  font-size: 1.25em;
  padding: 0.8em;
  min-width: 200px;
  background-color: ${palette('secondary', 0)};
  &:hover {
    background-color: ${palette('secondary', 1)};
  }
`;
// TODO @tmfrnz config
// background-color

export default ButtonHero;

import styled from 'styled-components';
import { palette } from 'styled-theme';
import ButtonDefault from '../ButtonDefault';

const ButtonHero = styled(ButtonDefault)`
  font-size: 1em;
  padding: 0.6em;
  min-width: 120px;
  background-color: ${palette('secondary', 0)};
  &:hover {
    background-color: ${palette('secondary', 1)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1.1em;
    padding: 0.8em;
    min-width: 160px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.25em;
    min-width: 200px;
  }
`;
// TODO @tmfrnz config
// background-color

export default ButtonHero;

import styled from 'styled-components';
import ButtonDefault from '../ButtonDefault';

const ButtonHero = styled(ButtonDefault)`
  font-size: 1em;
  padding: 0.6em;
  min-width: 120px;
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

export default ButtonHero;

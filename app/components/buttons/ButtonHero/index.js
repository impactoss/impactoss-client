import styled from 'styled-components';
import ButtonDefault from '../ButtonDefault';

const ButtonHero = styled(ButtonDefault)`
  font-size: 1em;
  padding: 0.6em;
  min-width: 120px;
  margin-left: ${({ space }) => space ? 10 : 0}px;
  margin-right: ${({ space }) => space ? 10 : 0}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1.1em;
    padding: 0.8em;
    min-width: 160px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.25em;
    min-width: 200px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

export default ButtonHero;

import styled from 'styled-components';

const Description = styled.p`
  margin-bottom: 1.5em;
  font-size: 1em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 2em;
    font-size: 1.1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

export default Description;

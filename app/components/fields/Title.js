import styled from 'styled-components';

const Title = styled.h1`
  margin: 0;
  font-size: 1.3em;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    font-size: 1.9em;
  }
`;

export default Title;

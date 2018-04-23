import styled from 'styled-components';

export default styled.a`
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  display: inline-flex;
  padding: 0.125em 0.75em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0.25em 1em;
  }
`;

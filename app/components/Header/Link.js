import styled from 'styled-components';

export default styled.a`
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  display: inline-flex;
  padding: 8px 0.75em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 8px 1em;
  }
`;

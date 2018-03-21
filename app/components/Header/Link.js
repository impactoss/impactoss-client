import styled from 'styled-components';

export default styled.a`
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  display: inline-flex;
  padding: 0.25em 1em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
`;

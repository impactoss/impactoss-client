import styled from 'styled-components';

export default styled.a`
  display: inline-flex;
  padding: 0.25em 1em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #929A9D;
  color:${(props) => props.active ? '#FFF' : '#929A9D'};

  &:hover {
    color: #FFF;
  }
`;

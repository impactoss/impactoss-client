import styled from 'styled-components';

export default styled.a`
  display: inline-flex;
  padding: 0.5em 1.5em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 0.8em;
  color:${(props) => props.active ? '#EB6E51' : '#DDE0E0'};

  &:hover {
    color: #EB6E51;
  }
`;

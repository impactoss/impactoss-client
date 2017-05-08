import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Roboto', Helvetica, sans-serif;
  }

  #app {
    background-color: #F1F3F3;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }

  a {
    color: #000;

    &:hover {
      color: #EB6E51;
  }

`;

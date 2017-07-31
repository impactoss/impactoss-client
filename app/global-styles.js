import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`

  html,
  body {
    height: 100%;
    width: 100%;
  }
  body {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.8;
    color: #21282B;
  }
  textarea {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #F5F6F6;
    min-height: 100%;
    min-width: 100%;
  }

  a {
    color: #027dbb;
    text-decoration: none;

    &:hover {
      color: #026B9F;
    }
  }

  h1 {
    font-size: 2.5em;
  }
  h2 {
    font-size: 2.15em;
  }
  h3 {
    font-size: 1.7em;
  }
  h4 {
    font-size: 1.5em;
  }
  h5 {
    font-size: 1.25em;
  }
  h6 {
    font-size: 1em;
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  p {
    margin-top: 0;
    margin-bottom:10px;
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .content-page {
    .react-markdown {
      p {
        &:first-child{
          font-size: 1.5em;
          padding-bottom: 15px;
        }
      }
    }
  }
`;

import { createGlobalStyle } from 'styled-components';
import Roboto400TTF from './fonts/roboto-400.ttf';
import Roboto400iTTF from './fonts/roboto-400i.ttf';
import Roboto500iTTF from './fonts/roboto-500i.ttf';
import Roboto500TTF from './fonts/roboto-500.ttf';
import Roboto700TTF from './fonts/roboto-700.ttf';
import Roboto700iTTF from './fonts/roboto-700i.ttf';

/* eslint no-unused-expressions: 0 */
const GlobalStyle = createGlobalStyle`

  /* roboto - 400 - latin */
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url(${Roboto400TTF}) format('truetype');
  }
  /* roboto - 400 - italic - latin */
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 400;
    src: url(${Roboto400iTTF}) format('truetype');
  }
  /* roboto - 500 - latin */
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url(${Roboto500TTF}) format('truetype');
  }
  /* roboto - 500 - italic - latin */
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 500;
    src: url(${Roboto500iTTF}) format('truetype');
  }
  /* roboto - 700 - latin */
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: url(${Roboto700TTF}) format('truetype');
  }
  /* roboto - 700 - italic - latin */
  @font-face {
    font-display: swap;
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 700;
    src: url(${Roboto700iTTF}) format('truetype');
  }

  html,
  body {
    height: 100%;
    width: 100%;
  }
  body {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.428571429;
    color: #1c2121;;
  }
  button, input, select, textarea {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: transparent;
    border-style: none;
    color: inherit;
    font-size: 1em;
    margin: 0;
  }

  *:focus-visible {
    outline: 2px solid black;
    outline-offset: 2px;
  }

  #app {
    background-color: #ffffff;
    min-height: 100%;
    min-width: 100%;
  }

  button {
    background: transparent;
    border: none;
    text-align: left;
  }
  a {
    background: transparent;
    border: none;
    text-align: left;
    color: #0077d8;
    text-decoration: none;
    &:hover {
      color: #d66149;
    }
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.25;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  h1 {
    font-weight: 700;
    font-size: 2em;
  }
  h2 {
    font-size: 1.6em;
  }
  h3 {
    font-size: 1.3em;
  }
  h4 {
    font-size: 1.1em;
  }
  h5 {
    font-size: 1em;
  }
  h6 {
    font-size: 0.9em;
  }
  @media (min-width: 769px) {
    h1 {
      font-size: 2.3em;
    }
    h2 {
      font-size: 2.15em;
    }
    h3 {
      font-size: 1.9em;
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
  }
  @media (min-width: 1200px) {
    h1 {
      font-size: 2.6em;
    }
    h2 {
      font-size: 2.25em;
    }
  }

  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  * {
    box-sizing: border-box;
  }

  .react-markdown {
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      margin-top: 1.75em;
      margin-bottom: 0.5em;
    }
    h1 {
      font-size: 1.75em;
      font-weight: 500;
    }
    h2 {
      font-size: 1.25em;
    }
    h3 {
      font-size: 1.15em;
    }
    h4 {
      font-size: 1em;
    }
    h5 {
      font-size: 1em;
    }
    h6 {
      font-size: 1em;
    }
    a {
      color: #BA5D03;
      font-weight: 500;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .content-page {
    .react-markdown {
      p {
        &:first-child{
          font-size: 1.2em;
          color: #6A7880;
        }
      }
    }
  }
  @media (min-width: 769px) {
    .content-page {
      .react-markdown {
        p {
          &:first-child{
            font-size: 1.5em;
            padding-bottom: 20px;
          }
        }
      }
    }
  }
  .download-csv-modal {
    z-index:105;
    max-width: none !important;
  }

  .global-settings-modal,
  .download-csv-modal,
  .new-entity-modal {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 0;
    overflow: auto;
    --webkit-overflow-scrolling: touch;
    border-radius: 0;
    outline: none;
    margin-right: auto;
    margin-left: auto;
    max-width: 1170px;
  }
  @media (min-width: 769px) {
    .global-settings-modal,
    .download-csv-modal,
    .new-entity-modal {
      padding: 20px;
      top: 40px;
      left: 40px;
      right: 40px;
      bottom: 40px;
    }
  }

  .download-csv-modal,
  .global-settings-modal-overlay,
  .new-entity-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
  }

  [type="checkbox"] {
    vertical-align: middle;
    position: relative;
    bottom: 1px;
  }

  ._react-file-reader-input {
    display: inline-block;
  }

  @media print and (color){
    #app {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
  }
  @media print {
    @page {
      margin: 1.5cm 1.2cm 1.5cm;
    }
    body {
      font-size: 10pt;
    }
    button, input, select, textarea {
      font-size: 10pt;
      page-break-inside: avoid;
    }
    a {
      page-break-inside: avoid;
    }
    #app {
      background-color: white;
    }
    h1 {
      font-size: 20pt;
    }
    h2 {
      font-size: 16pt;
    }
    h3 {
      font-size: 13pt;
    }
    h4 {
      font-size: 11pt;
    }
    h5 {
      font-size: 10pt;
    }
    h6 {
      font-size: 9pt;
    }
    blockquote {
      page-break-inside: avoid;
    }
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      page-break-inside: avoid;
    }
    img {
      page-break-inside: avoid;
      page-break-after: avoid;
    }
    table, pre {
      page-break-inside: avoid;
    }
    ul, ol, dl {
      page-break-before: avoid;
    }

    .content-page {
      .react-markdown {
        p {
          &:first-child{
            font-size: 12pt;
          }
        }
      }
    }
  }

  /* accessability styles */


`;

export default GlobalStyle;

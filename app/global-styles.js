import { createGlobalStyle } from 'styled-components';

/* eslint no-unused-expressions: 0 */
const GlobalStyle = createGlobalStyle`

  html,
  body {
    height: 100%;
    width: 100%;
  }
  body {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.428571429;
    color: #1c2121;
  }
  button, input, select, textarea {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: transparent;
    border-style: none;
    color: inherit;
    font-size: 1em;
    margin: 0;
  }
  :focus, :visited:focus {
    outline: 5px auto rgb(77, 144, 254); /* TODO: improve focus styles and individualise for specific buttons and links */
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
      color: #0063b5;
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
    .new-entity-modal {
      padding: 20px;
      top: 40px;
      left: 40px;
      right: 40px;
      bottom: 40px;
    }
  }

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
`;

export default GlobalStyle;

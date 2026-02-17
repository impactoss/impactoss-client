import React from 'react';
import PropTypes from 'prop-types';
import { useCSVDownloader } from 'react-papaparse';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const StyledDownloaderSubmit = styled.span`
  button {
    /* Button base */
    display: inline-block;
    cursor: pointer;
    font-size: 0.9em;
    text-align: center;
    vertical-align: middle;
    line-height: 1.25;
    touch-action: manipulation;
    user-select: none;
    background-image: none;
    border: none;
    border-radius: 0;
    /* ButtonForm */
    font-weight: bold;
    text-transform: uppercase;
    padding: 0.7em 0.5em;
    /* ButtonSubmit */
    color: ${palette('buttonDefault', 0)};
    background-color: ${palette('buttonDefault', 1)};
    &:hover, &:focus-visible {
      color: ${palette('buttonDefaultHover', 0)};
      background-color: ${palette('buttonDefaultHover', 1)};
    }
    @media (min-width: ${(props) => props.theme.breakpoints.small}) {
      letter-spacing: 1px;
      font-size: 1em;
      padding: 1em 1.2em;
    }
  }
`;

const StyledDownloaderInline = styled.span`
  button {
    display: inline;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: ${palette('link', 0)};
    &:hover {
      color: ${palette('linkHover', 0)};
    }
  }
`;
const CsvDownloadHandler = ({
  children,
  buttonType,
  onClick,
  ...props
}) => {
  const { CSVDownloader, Type } = useCSVDownloader();
  const Wrapper = buttonType === 'submit' ? StyledDownloaderSubmit : StyledDownloaderInline;

  return (
    <Wrapper onClick={onClick}>
      <CSVDownloader type={Type.Button} {...props}>
        {children}
      </CSVDownloader>
    </Wrapper>
  );
};
CsvDownloadHandler.propTypes = {
  children: PropTypes.node,
  buttonType: PropTypes.string,
  onClick: PropTypes.func,
};
export default CsvDownloadHandler;

import React from 'react';
import { useCSVDownloader } from 'react-papaparse';
import styled from 'styled-components';

const CsvDownloadHandler = ({ children, ...props }) => {
  const { CSVDownloader, Type } = useCSVDownloader();
  return (
    <CSVDownloader type={Type.Button} className="ioss-csv-downloader" {...props}>
      {children}
    </CSVDownloader>
  );
};
export default CsvDownloadHandler;

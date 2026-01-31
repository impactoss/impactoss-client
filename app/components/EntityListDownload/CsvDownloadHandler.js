import React from 'react';
import { useCSVDownloader } from 'react-papaparse';

const CsvDownloadHandler = ({ children, ...props }) => {
  const { CSVDownloader } = useCSVDownloader();
  return (
    <CSVDownloader {...props}>
      {children}
    </CSVDownloader>
  );
};
export default CsvDownloadHandler;

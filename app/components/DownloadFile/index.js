import React from 'react';

import { getFilenameFromUrl } from 'utils/string';

const DownloadFile = ({ url }) => {
  const filename = getFilenameFromUrl(url);
  return (
    <span>
      {`${filename} `}
      <a href={url} download>Download</a>
    </span>
  );
};

DownloadFile.propTypes = {
  url: React.PropTypes.string,
};

export default DownloadFile;

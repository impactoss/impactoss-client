import React from 'react';

import { getFilenameFromUrl } from 'utils/string';

class DownloadFile extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const filename = getFilenameFromUrl(this.props.url);
    return (
      <span>
        {`${filename} `}
        <a href={this.props.url} download>Download</a>
      </span>
    );
  }
}

DownloadFile.propTypes = {
  url: React.PropTypes.string,
};

export default DownloadFile;

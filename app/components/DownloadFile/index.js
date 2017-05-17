import React from 'react';
import styled from 'styled-components';

import Icon from 'components/Icon';
import A from 'components/basic/A';

import { getFilenameFromUrl } from 'utils/string';

const DownloadA = styled(A)`
  font-weight: bold;
  font-size: 1.2em;
`;

const DownloadFile = ({ url }) => {
  const filename = getFilenameFromUrl(url);
  return (
    <DownloadA href={url} download>
      {filename}
      <Icon name="download" text textRight size="2em" />
    </DownloadA>
  );
};

DownloadFile.propTypes = {
  url: React.PropTypes.string,
};

export default DownloadFile;

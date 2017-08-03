import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/Icon';
import A from 'components/styled/A';

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
      <Icon name="download" text textRight />
    </DownloadA>
  );
};

DownloadFile.propTypes = {
  url: PropTypes.string,
};

export default DownloadFile;

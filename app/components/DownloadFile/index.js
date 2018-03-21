import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/Icon';
import A from 'components/styled/A';

import { getFilenameFromUrl } from 'utils/string';

const DownloadA = styled(A)`
  max-width: 100%;
  padding-right: 45px;
  position: relative;
  display: block;
`;

const FileName = styled.div`
  overflow: hidden;
  font-weight: 500;
  font-size: 1.1em;
`;
const DownloadIcon = styled.div`
  display: block;
  position:absolute;
  right: 0;
  top: 0;
  bottom: 0;
`;

const DownloadFile = ({ url }) => {
  const filename = getFilenameFromUrl(url);
  return (
    <DownloadA href={url} download>
      <FileName>{filename}</FileName>
      <DownloadIcon>
        <Icon name="download" text textRight />
      </DownloadIcon>
    </DownloadA>
  );
};

DownloadFile.propTypes = {
  url: PropTypes.string,
};

export default DownloadFile;

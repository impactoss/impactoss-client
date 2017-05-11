import React from 'react';

import { FormattedMessage } from 'react-intl';
import DownloadFile from 'components/DownloadFile';

import messages from './messages';

const DocumentView = ({ status, url }) => {
  const publicDoc = status;
  return (
    <span>
      {url && publicDoc &&
        <DownloadFile url={url} />
      }
      {url && !publicDoc &&
        <FormattedMessage {...messages.privateFile} />
      }
      {!url &&
        <FormattedMessage {...messages.noFile} />
      }
    </span>
  );
};

DocumentView.propTypes = {
  url: React.PropTypes.string,
  status: React.PropTypes.bool,
};

export default DocumentView;

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import DownloadFile from 'components/DownloadFile';

import messages from './messages';

const DocumentView = ({ status, url, isManager }) => {
  const visibleDoc = status || isManager;
  return (
    <span>
      {url && visibleDoc &&
        <DownloadFile url={url} />
      }
      {url && !visibleDoc &&
        <FormattedMessage {...messages.privateFile} />
      }
      {!url &&
        <FormattedMessage {...messages.noFile} />
      }
    </span>
  );
};

DocumentView.propTypes = {
  url: PropTypes.string,
  status: PropTypes.bool,
  isManager: PropTypes.bool,
};

export default DocumentView;

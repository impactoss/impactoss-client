/*
 *
 * FormattedMessageMarkdown
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Remarkable from 'remarkable';

const md = new Remarkable({ html: false, breaks: false });

const FormattedMessageMarkdown = ({
  message,
  intl,
}) => {
  const text = message
    ? intl.formatMessage(message).trim()
    : 'MESSAGE NOT FOUND';

  const inlineHtml = md.renderInline(text);
  /* eslint-disable react/no-danger */
  return <span className="formatted-message-remarkable" dangerouslySetInnerHTML={{ __html: inlineHtml }} />;
};

FormattedMessageMarkdown.propTypes = {
  message: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(FormattedMessageMarkdown);

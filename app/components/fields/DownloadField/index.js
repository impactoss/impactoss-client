import React from 'react';
import PropTypes from 'prop-types';
import DocumentView from 'components/DocumentView';

import appMessages from 'containers/App/messages';

import FieldWrap from '../FieldWrap';
import LabelLarge from '../LabelLarge';
import DocumentWrap from '../DocumentWrap';
import EmptyHint from '../EmptyHint';

class DownloadField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <LabelLarge>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.document_url)}
        </LabelLarge>
        { field.value &&
          <DocumentWrap>
            <DocumentView url={field.value} isManager={field.isManager} status={field.public} />
          </DocumentWrap>
        }
        { !field.value &&
          <EmptyHint>{field.showEmpty}</EmptyHint>
        }
      </FieldWrap>
    );
  }
}

DownloadField.propTypes = {
  field: PropTypes.object.isRequired,
};
DownloadField.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default DownloadField;

import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';
import { FormattedMessage, injectIntl } from 'react-intl';

import appMessage from 'utils/app-message';
import appMessages from 'containers/App/messages';

import { PUBLISH_STATUSES } from 'themes/config';

import Label from 'components/fields/Label';
import FieldWrapInline from 'components/fields/FieldWrapInline';
import Status from 'components/fields/Status';

class StatusField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field, intl } = this.props;
    const status = find(field.options || PUBLISH_STATUSES, { value: field.value });

    return (
      <FieldWrapInline>
        <Label>
          <FormattedMessage {...(field.label || appMessages.attributes.status)} />
        </Label>
        <Status>
          { status && status.message
            ? appMessage(intl, status.message)
            : ((status && status.label) || field.value)
          }
        </Status>
      </FieldWrapInline>
    );
  }
}

StatusField.propTypes = {
  field: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(StatusField);

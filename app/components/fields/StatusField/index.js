import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Label from 'components/fields/Label';
import FieldWrapInline from 'components/fields/FieldWrapInline';
import Status from 'components/fields/Status';

class StatusField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrapInline>
        <Label>
          <FormattedMessage {...(field.label || appMessages.attributes.status)} />
        </Label>
        <Status>
          {
            find(field.options || PUBLISH_STATUSES, { value: field.value }).label
          }
        </Status>
      </FieldWrapInline>
    );
  }
}

StatusField.propTypes = {
  field: PropTypes.object.isRequired,
};
StatusField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default StatusField;

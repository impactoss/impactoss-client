import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrapInline from 'components/fields/FieldWrapInline';
import Label from 'components/fields/Label';
import Status from 'components/fields/Status';

class RoleField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrapInline>
        <Label>
          <FormattedMessage {...(field.label || appMessages.entities.roles.single)} />
        </Label>
        <Status>
          {field.value || this.context.intl.formatMessage(appMessages.entities.roles.defaultRole)}
        </Status>
      </FieldWrapInline>
    );
  }
}

RoleField.propTypes = {
  field: PropTypes.object.isRequired,
};
RoleField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default RoleField;

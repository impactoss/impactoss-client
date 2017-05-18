import React, { PropTypes } from 'react';

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
          {field.label || this.context.intl.formatMessage(appMessages.entities.roles.single)}
        </Label>
        <Status>{field.value || field.showEmpty}</Status>
      </FieldWrapInline>
    );
  }
}

RoleField.propTypes = {
  field: PropTypes.object.isRequired,
};
RoleField.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default RoleField;

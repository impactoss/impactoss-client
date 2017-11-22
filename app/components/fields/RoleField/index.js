import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';
import { FormattedMessage } from 'react-intl';

import appMessage from 'utils/app-message';

import appMessages from 'containers/App/messages';

import { USER_ROLES } from 'themes/config';

import FieldWrapInline from 'components/fields/FieldWrapInline';
import Label from 'components/fields/Label';
import Status from 'components/fields/Status';

class RoleField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;

    const role = find(field.options || USER_ROLES, { value: parseInt(field.value, 10) });

    return (
      <FieldWrapInline>
        <Label>
          <FormattedMessage {...(field.label || appMessages.entities.roles.single)} />
        </Label>
        <Status>
          { role && role.message
            ? appMessage(this.context.intl, role.message)
            : ((role && role.label) || field.value)
          }
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

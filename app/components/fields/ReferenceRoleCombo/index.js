import React, { PropTypes } from 'react';

import FieldWrap from 'components/fields/FieldWrap';
import ReferenceField from 'components/fields/ReferenceField';
import RoleField from 'components/fields/RoleField';

class ReferenceRoleCombo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        {
          field.fields.map((rsField, i) => (
            <span key={i}>
              { rsField.type === 'reference' &&
                <ReferenceField field={rsField} />
              }
              { rsField.type === 'role' &&
                <RoleField field={rsField} />
              }
            </span>
          ))
        }
      </FieldWrap>
    );
  }
}

ReferenceRoleCombo.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ReferenceRoleCombo;

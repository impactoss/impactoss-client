import React from 'react';
import PropTypes from 'prop-types';

import FieldWrap from 'components/fields/FieldWrap';
import ReferenceField from 'components/fields/ReferenceField';
import StatusField from 'components/fields/StatusField';

class ReferenceStatusCombo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
              { rsField.type === 'status' &&
                <StatusField field={rsField} />
              }
            </span>
          ))
        }
      </FieldWrap>
    );
  }
}

ReferenceStatusCombo.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ReferenceStatusCombo;

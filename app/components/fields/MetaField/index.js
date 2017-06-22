import React, { PropTypes } from 'react';

// import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
// import Label from 'components/fields/Label';
import Meta from 'components/fields/Meta';

class MetaField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        {
          field.fields.map((metaField, i) => (
            <Meta key={i}>
              {`${metaField.label}: ${metaField.value}`}
            </Meta>
          ))
        }
      </FieldWrap>
    );
  }
}

MetaField.propTypes = {
  field: PropTypes.object.isRequired,
};
MetaField.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default MetaField;

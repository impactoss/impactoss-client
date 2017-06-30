import React from 'react';
import PropTypes from 'prop-types';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import Meta from 'components/fields/Meta';

class MetaField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.meta.title)}
        </Label>
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
  intl: PropTypes.object.isRequired,
};

export default MetaField;

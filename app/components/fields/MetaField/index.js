import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import Meta from 'components/fields/Meta';

class MetaField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field, intl } = this.props;
    return (
      <FieldWrap>
        <Label>
          <FormattedMessage {...(field.label || appMessages.attributes.metaTitle)} />
        </Label>
        {
          field.fields.map((metaField, i) => {
            const value = metaField.date
              ? intl.formatDate(new Date(metaField.value))
              : metaField.value;
            const time = typeof metaField.time !== 'undefined'
              ? `, ${intl.formatTime(new Date(metaField.value))}`
              : '';
            const label = intl.formatMessage(metaField.label);
            return (
              <Meta key={i}>
                {`${label}: ${value}${time}`}
              </Meta>
            );
          })
        }
      </FieldWrap>
    );
  }
}

MetaField.propTypes = {
  field: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(MetaField);

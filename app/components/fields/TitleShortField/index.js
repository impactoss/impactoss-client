import React, { PropTypes } from 'react';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import ShortTitleTag from 'components/fields/ShortTitleTag';

class TitleShortField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.short_title)}
        </Label>
        <ShortTitleTag pIndex={field.taxonomyId}>{field.value}</ShortTitleTag>
      </FieldWrap>
    );
  }
}

TitleShortField.propTypes = {
  field: PropTypes.object.isRequired,
};
TitleShortField.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
export default TitleShortField;

import React, { PropTypes } from 'react';

// import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
// import Label from 'components/fields/Label';
import TitleText from 'components/fields/TitleText';

class TitleField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <TitleText>{field.value}</TitleText>
      </FieldWrap>
    );
  }
}

TitleField.propTypes = {
  field: PropTypes.object.isRequired,
};
TitleField.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default TitleField;

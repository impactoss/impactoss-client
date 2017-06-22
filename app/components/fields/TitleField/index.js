import React, { PropTypes } from 'react';

// import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
// import Label from 'components/fields/Label';
import Title from 'components/fields/Title';

class TitleField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Title>{field.value}</Title>
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

import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';

class MarkdownField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        {field.label &&
          <Label>
            {field.label}
          </Label>
        }
        <ReactMarkdown source={field.value} />
      </FieldWrap>
    );
  }
}

MarkdownField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default MarkdownField;

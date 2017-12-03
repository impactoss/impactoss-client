import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
// import appMessages from 'containers/App/messages';

const Markdown = styled(ReactMarkdown)`
  font-size: ${(props) => props.theme.sizes.text.markdown};
  line-height: ${(props) => props.theme.sizes.lineHeights.markdown};
`;

class MarkdownField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        {field.label &&
          <Label>
            <FormattedMessage {...field.label} />
          </Label>
        }
        <Markdown source={field.value} className="react-markdown" />
      </FieldWrap>
    );
  }
}

MarkdownField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default MarkdownField;

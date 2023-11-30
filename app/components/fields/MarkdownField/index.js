import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
// import appMessages from 'containers/App/messages';

const Markdown = styled(ReactMarkdown)`
  font-size: ${(props) => props.theme.text.mediumTall.size};
  line-height: ${(props) => props.theme.text.mediumTall.height};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.text.largeTall.size};
    line-height: ${(props) => props.theme.text.largeTall.height};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.markdown};
  }
`;

const RenderLink = ({ href, children }) => {
  if (!href.startsWith('http')) {
    return href;
  }
  return <a href={href} rel="nofollow noreferrer noopener" target="_blank">{children}</a>;
};

RenderLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

// TODO also render HTML if not markdown
function MarkdownField({ field }) {
  return (
    <FieldWrap>
      {field.label
        && (
          <Label>
            <FormattedMessage {...field.label} />
          </Label>
        )
      }
      <Markdown
        source={field.value}
        linkTarget="_blank"
        className="react-markdown"
      />
    </FieldWrap>
  );
}

MarkdownField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default MarkdownField;

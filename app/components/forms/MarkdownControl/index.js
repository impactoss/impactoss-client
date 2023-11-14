import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import A from 'components/styled/A';
import ControlTextAreaLarge from '../ControlTextAreaLarge';
import messages from './messages';

const MarkdownHint = styled.div`
  text-align: right;
  color: ${palette('text', 1)};
  font-size: 0.85em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
export class MarkdownControl extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { model, ...props } = this.props;
    const { intl } = this.context;
    return (
      <span>
        <ControlTextAreaLarge
          model={model}
          {...props}
        />
        <MarkdownHint>
          <A
            href={intl.formatMessage(messages.url)}
            target="_blank"
            isOnLightBackground
          >
            {intl.formatMessage(messages.anchor)}
          </A>
          {intl.formatMessage(messages.hint)}
        </MarkdownHint>
      </span>
    );
  }
}

MarkdownControl.propTypes = {
  model: PropTypes.string.isRequired,
};
MarkdownControl.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default MarkdownControl;

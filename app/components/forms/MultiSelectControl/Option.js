import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import { lowerCase } from 'utils/string';
import appMessage from 'utils/app-message';

import ItemStatus from 'components/ItemStatus';

import messages from './messages';

const Label = styled.div`
  font-weight: ${(props) => props.bold ? 500 : 'normal'};
  position: relative;
`;
const New = styled.span`
  color: ${palette('primary', 4)};
  background-color: ${palette('primary', 0)};
  padding: 1px 5px;
  font-size: 0.8em;
  margin-left: 0.5em;
  border-radius: 4px;
`;
const Id = styled.span`
  color: ${palette('text', 1)};
  font-size: 0.9em;
`;
const IdSpacer = styled.span`
  padding-left: 0.25em;
  padding-right: 0.25em;
  color: ${palette('text', 1)};
`;
// <Label bold={props.bold} italic={props.isNew}>
class Option extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { draft, reference, message, label, messagePrefix, isNew } = this.props;

    let optionLabel;
    if (message) {
      optionLabel = messagePrefix
        ? `${messagePrefix} ${lowerCase(appMessage(this.context.intl, message))}`
        : appMessage(this.context.intl, message);
    } else {
      optionLabel = label;
    }


    return (
      <Label bold={false}>
        {draft &&
          <ItemStatus draft top />
        }
        {reference &&
          <Id>{reference}</Id>
        }
        {reference &&
          <IdSpacer />
        }
        { optionLabel }
        {isNew &&
          <New>
            <FormattedMessage {...messages.new} />
          </New>
        }
      </Label>
    );
  }
}

Option.propTypes = {
  label: PropTypes.string,
  message: PropTypes.string,
  messagePrefix: PropTypes.string,
  reference: PropTypes.string,
  draft: PropTypes.bool,
  isNew: PropTypes.bool,
};

Option.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Option;

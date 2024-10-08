import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage, injectIntl } from 'react-intl';

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
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const Id = styled.span`
  color: ${palette('text', 1)};
  font-size: 0.9em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;
const Sublabel = styled.div`
  color: ${palette('text', 1)};
  font-size: 0.8em;
  opacity: 0.6;
  padding-top: 4px;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;
const IdSpacer = styled.span`
  padding-left: 0.25em;
  padding-right: 0.25em;
  color: ${palette('text', 1)};
`;
// <Label bold={props.bold} italic={props.isNew}>
class Option extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      draft, reference, message, label, messagePrefix, isNew, sublabel, intl,
    } = this.props;

    let optionLabel;
    if (message) {
      optionLabel = messagePrefix
        ? `${messagePrefix} ${lowerCase(appMessage(intl, message))}`
        : appMessage(intl, message);
    } else {
      optionLabel = label;
    }


    return (
      <Label bold={false}>
        <div>
          {draft
            && <ItemStatus draft top />
          }
          {reference
            && <Id>{reference}</Id>
          }
          {reference
            && <IdSpacer />
          }
          { optionLabel }
          {isNew
            && (
              <New>
                <FormattedMessage {...messages.new} />
              </New>
            )
          }
        </div>
        {sublabel && (
          <Sublabel>{sublabel}</Sublabel>
        )}
      </Label>
    );
  }
}

Option.propTypes = {
  label: PropTypes.string,
  message: PropTypes.string,
  messagePrefix: PropTypes.string,
  reference: PropTypes.string,
  sublabel: PropTypes.string,
  draft: PropTypes.bool,
  isNew: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Option);

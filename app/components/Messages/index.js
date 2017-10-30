import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import {
  RECORD_OUTDATED,
  EMAIL_FORMAT,
  PASSWORD_MISMATCH,
  PASSWORD_SHORT,
  PASSWORD_INVALID,
} from 'containers/App/constants';
import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import componentMessages from './messages';

const Styled = styled.div`
  display: table;
  width: 100%;
  color: ${(props) => props.details ? palette('dark', 0) : palette(props.palette, 4)};
  background-color: ${(props) => palette(props.palette, props.details ? 3 : 0)};
  position: relative;
  z-index: 1;
  box-shadow: ${(props) => props.withoutShadow ? 0 : '0px 0px 15px 0px rgba(0,0,0,0.2)'};
  margin-bottom: ${(props) => !props.spaceMessage ? 0 : '20px'};
`;

const Message = styled.div`
  padding: ${(props) => props.details ? '0.5em 1em' : 0};
  border: ${(props) => props.details ? '1px solid' : 0};
  border-color: ${(props) => palette(props.palette, 0)};
  border-bottom: 0;

  &:last-child {
    border-bottom: ${(props) => props.details ? '1px solid' : 0};
    border-color: ${(props) => palette(props.palette, 0)};
  }
`;

const MessageWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding: ${(props) => props.details ? 0 : '1em'};
`;

const DismissWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding: 1em;
  text-align: right;
`;
const PreMessage = styled.div``;
const Dismiss = styled(Button)``;

class Messages extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  translateMessage = (message) => {
    if (message === RECORD_OUTDATED) {
      return this.context.intl.formatMessage(appMessages.forms.outdatedError);
    }
    if (message === EMAIL_FORMAT) {
      return this.context.intl.formatMessage(appMessages.forms.emailFormatError);
    }
    if (message === PASSWORD_MISMATCH) {
      return this.context.intl.formatMessage(appMessages.forms.passwordMismatchError);
    }
    if (message === PASSWORD_SHORT) {
      return this.context.intl.formatMessage(appMessages.forms.passwordShortError);
    }
    if (message === PASSWORD_INVALID) {
      return this.context.intl.formatMessage(appMessages.forms.passwordInvalidError);
    }
    return message;
  }

  render() {
    const { type, message, messageKey, messages, onDismiss, preMessage, details } = this.props;
    return !(message || messageKey || messages)
    ? null
    : (
      <Styled palette={type} details={details} withoutShadow={details} spaceMessage={this.props.spaceMessage}>
        <MessageWrapper details={details}>
          { type === 'error' && preMessage &&
            <PreMessage>
              <strong>
                <FormattedMessage {...componentMessages.preBold} />
              </strong>
              <FormattedMessage {...componentMessages.preAdditional} />
            </PreMessage>
          }
          { message &&
            <Message
              details={details}
              palette={type}
            >
              {message}
            </Message>
          }
          { messageKey &&
            <div>
              <FormattedMessage
                values={this.props.messageArgs}
                {...appMessages.messages[messageKey]}
              />
            </div>
          }
          { messages && messages.map((m, i) => (
            <Message
              key={i}
              details={details}
              palette={type}
            >
              {this.translateMessage(m)}
            </Message>
          ))}
        </MessageWrapper>
        { onDismiss &&
          <DismissWrapper>
            <Dismiss onClick={onDismiss} >
              <Icon name="removeLarge" />
            </Dismiss>
          </DismissWrapper>
        }
      </Styled>
    );
  }
}

Messages.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  messageKey: PropTypes.string,
  messageArgs: PropTypes.object,
  messages: PropTypes.array,
  onDismiss: PropTypes.func,
  spaceMessage: PropTypes.bool,
  preMessage: PropTypes.bool,
  details: PropTypes.bool,
};

Messages.defaultProps = {
  preMessage: true,
};
Messages.contextTypes = {
  intl: PropTypes.object,
};

export default Messages;

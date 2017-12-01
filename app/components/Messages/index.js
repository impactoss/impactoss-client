import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import { reduce } from 'lodash/collection';

import asArray from 'utils/as-array';
import { SERVER_ERRORS } from 'themes/config';
import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import componentMessages from './messages';

const Styled = styled.div`
  display: table;
  width: 100%;
  color: ${(props) => palette(props.palette, props.details ? 0 : 4)};
  background-color: ${(props) => palette(props.palette, props.details ? 3 : 1)};
  position: relative;
  z-index: 1;
  box-shadow: ${(props) => props.withoutShadow ? 0 : '0px 0px 15px 0px rgba(0,0,0,0.2)'};
  margin-bottom: ${(props) => !props.spaceMessage ? 0 : '20px'};
`;

const Message = styled.div`
  padding: ${(props) => props.details ? '0.25em 1em' : 0};
  border: ${(props) => props.details ? '1px solid' : 0};
  border-color: ${(props) => palette(props.palette, 0)};
  border-bottom: 0;
  padding-right: ${(props) => props.details && props.dismiss ? '50px' : 0};

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
  text-align: right;
  padding: ${(props) => props.details ? 0 : '1em'};
`;
const DismissWrapperDetails = styled.div`
  position: absolute;
  right: -3px;
  top: -4px;
`;
const PreMessage = styled.div``;
const Dismiss = styled(Button)``;

class Messages extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    if (this.props.onDismiss && typeof this.props.autoDismiss !== 'undefined') {
      setTimeout(() => this.props.onDismiss(), this.props.autoDismiss);
    }
  }
  translateMessages = (messages) =>
    reduce(asArray(messages), (memo, message) => memo
      ? `${memo} ${this.translateMessage(message)}`
      : this.translateMessage(message)
    , null);

  translateMessage = (message) => {
    if (message === SERVER_ERRORS.RECORD_OUTDATED) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.outdatedError);
    }
    if (message === SERVER_ERRORS.EMAIL_FORMAT) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.emailFormatError);
    }
    if (message === SERVER_ERRORS.PASSWORD_MISMATCH) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.passwordMismatchError);
    }
    if (message === SERVER_ERRORS.PASSWORD_SHORT) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.passwordShortError);
    }
    if (message === SERVER_ERRORS.PASSWORD_INVALID) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.passwordInvalidError);
    }
    if (message === SERVER_ERRORS.TITLE_REQUIRED) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.titleRequiredError);
    }
    if (message === SERVER_ERRORS.REFERENCE_REQUIRED) {
      return this.context.intl && this.context.intl.formatMessage(appMessages.forms.referenceRequiredError);
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
              palette={type}
              details={details}
              dismiss={!!onDismiss}
            >
              {this.translateMessages(message)}
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
              palette={type}
              details={details}
              dismiss={!!onDismiss}
            >
              {this.translateMessages(m)}
            </Message>
          ))}
          { onDismiss && details &&
            <DismissWrapperDetails>
              <Dismiss onClick={onDismiss}>
                <Icon name="removeLarge" />
              </Dismiss>
            </DismissWrapperDetails>
          }
        </MessageWrapper>
        { onDismiss && !details &&
          <DismissWrapper>
            <Dismiss onClick={onDismiss}>
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
  autoDismiss: PropTypes.number,
};

Messages.defaultProps = {
  preMessage: true,
};
Messages.contextTypes = {
  intl: PropTypes.object,
};

export default Messages;

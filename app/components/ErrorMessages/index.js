import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import { RECORD_OUTDATED } from 'containers/App/constants';
import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import messages from './messages';

const Styled = styled.div`
  display: table;
  width: 100%;
  color: ${palette('primary', 4)};
  background-color: ${palette('danger', 0)};
  position: relative;
  z-index: 1;
  box-shadow: ${(props) => props.withoutShadow ? 0 : '0px 0px 15px 0px rgba(0,0,0,0.2)'};
`;

const MessageWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding: 1em;
`;
const DismissWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding: 1em;
  text-align: right;
`;
const Dismiss = styled(Button)``;

const Message = styled.div``;

class ErrorMessages extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  translateMessage = (message) => {
    if (message === RECORD_OUTDATED) {
      return this.context.intl.formatMessage(appMessages.forms.outdatedError);
    }
    return message;
  }

  render() {
    return (
      <Styled>
        <MessageWrapper>
          <div>
            <strong>
              <FormattedMessage {...messages.preBold} />
            </strong>
            <FormattedMessage {...messages.preAdditional} />
            {
              this.props.error.messages && this.props.error.messages.map((message, i) => (
                <Message key={i}>{this.translateMessage(message)}</Message>
              ))
            }
          </div>
        </MessageWrapper>
        { this.props.onDismiss &&
          <DismissWrapper>
            <Dismiss onClick={this.props.onDismiss} >
              <Icon name="removeLarge" />
            </Dismiss>
          </DismissWrapper>
        }
      </Styled>
    );
  }
}

ErrorMessages.propTypes = {
  error: PropTypes.object,
  onDismiss: PropTypes.func,
};
ErrorMessages.contextTypes = {
  intl: PropTypes.object,
};

export default ErrorMessages;

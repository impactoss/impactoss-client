import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

const Styled = styled.div`
  display: table;
  width: 100%;
  color: ${(props) => palette(props.palette, 4)};
  background-color: ${(props) => palette(props.palette, 0)};
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

class QueryMessages extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    let messageStyle = '';
    if (this.props.error) {
      messageStyle = 'danger';
    } else if (this.props.warning) {
      messageStyle = 'alert';
    } else if (this.props.info) {
      messageStyle = 'info';
    }

    return !(this.props.error || this.props.warning || this.props.info)
    ? null
    : (
      <Styled palette={messageStyle}>
        <MessageWrapper>
          <div>
            { this.props.info &&
              <FormattedMessage {...appMessages.messages.info[this.props.info]} />
            }
            { this.props.warning &&
              <FormattedMessage {...appMessages.messages.warning[this.props.warning]} />
            }
            { this.props.error &&
              <FormattedMessage {...appMessages.messages.error[this.props.error]} />
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

QueryMessages.propTypes = {
  info: PropTypes.string,
  warning: PropTypes.string,
  error: PropTypes.string,
  onDismiss: PropTypes.func,
};
QueryMessages.contextTypes = {
  intl: PropTypes.object,
};

export default QueryMessages;

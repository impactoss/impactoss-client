import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import messages from './messages';

const Status = styled.div`
  float: right;
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  color: ${palette('dark', 3)};
  padding-left: 1em;
`;

class ItemStatus extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { draft } = this.props;
    return draft
      ? (<Status>
        {this.context.intl && this.context.intl.formatMessage(messages.draft)}
      </Status>)
      : null
    ;
  }
}

ItemStatus.propTypes = {
  draft: PropTypes.bool,
};

ItemStatus.contextTypes = {
  intl: PropTypes.object,
};

export default ItemStatus;

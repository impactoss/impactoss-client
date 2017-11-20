import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from 'components/styled/Label';
import messages from './messages';

const Status = styled(Label)`
  float: right;
  padding-left: 1em;
  font-weight: bold;
  font-size: 12px;
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

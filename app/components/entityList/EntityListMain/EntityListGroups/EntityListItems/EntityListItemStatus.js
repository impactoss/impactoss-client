import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import messages from 'components/entityList/EntityListMain/EntityListGroups/messages';

const Status = styled.div`
  float: right;
  font-weight: bold;
  font-size: 0.8em;
  text-transform: uppercase;
  color: ${palette('dark', 4)};
`;

class EntityListItemStatus extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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

EntityListItemStatus.propTypes = {
  draft: PropTypes.bool,
};

EntityListItemStatus.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemStatus;

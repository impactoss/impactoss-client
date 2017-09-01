import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { palette } from 'styled-theme';

import messages from 'components/entityList/EntityListMain/EntityListGroups/messages';

class EntityListNestedNoItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    type: PropTypes.string,
  }

  render() {
    const { type } = this.props;
    return (
      <span>
        {this.context.intl && this.context.intl.formatMessage(messages.nestedListEmpty[type])}
      </span>
    );
  }
}

EntityListNestedNoItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedNoItem;

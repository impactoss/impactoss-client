import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import messages from 'components/entityList/EntityListMain/EntityListGroups/messages';

const Styled = styled.span`
  padding: 10px 15px;
  font-weight: 500;
  display:inline-block;
  vertical-align: top;
  color: ${palette('light', 3)};
`;

class EntityListNestedNoItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { type, nestLevel } = this.props;
    return (
      <Styled nestLevel={nestLevel}>
        {this.context.intl && this.context.intl.formatMessage(messages.nestedListEmpty[type])}
      </Styled>
    );
  }
}


EntityListNestedNoItem.propTypes = {
  type: PropTypes.string,
  nestLevel: PropTypes.number,
};

EntityListNestedNoItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedNoItem;

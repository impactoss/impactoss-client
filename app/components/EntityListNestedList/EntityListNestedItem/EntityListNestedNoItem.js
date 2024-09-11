import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { injectIntl } from 'react-intl';

import messages from 'components/EntityListMain/EntityListGroups/messages';

const Styled = styled.span`
  padding-right: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
  padding-left: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  display:inline-block;
  vertical-align: top;
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemTop};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.listItemTop};
  }
`;

class EntityListNestedNoItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { type, nestLevel, intl } = this.props;
    return (
      <Styled nestLevel={nestLevel}>
        {intl && intl.formatMessage(messages.nestedListEmpty[type])}
      </Styled>
    );
  }
}


EntityListNestedNoItem.propTypes = {
  type: PropTypes.string,
  nestLevel: PropTypes.number,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntityListNestedNoItem);

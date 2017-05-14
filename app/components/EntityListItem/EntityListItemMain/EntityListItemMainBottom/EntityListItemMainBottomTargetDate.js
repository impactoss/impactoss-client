import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';


const Date = styled.span`
  font-size: 0.8em;
  color: ${palette('greyscaleLight', 3)};
`;

export default class EntityListItemMainBottomTargetDate extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    date: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Date>
        <Icon name="calendar" text />
        {this.props.date}
      </Date>
    );
  }
}

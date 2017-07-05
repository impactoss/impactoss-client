import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';


const Date = styled.span`
  font-size: 0.8em;
  color: ${palette('light', 3)};
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

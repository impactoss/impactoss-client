import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import BottomIconWrap from './BottomIconWrap';

const Styled = styled.span`
  display: inline-block;
  margin-right: 1em;
  color: ${palette('text', 1)};
  margin-bottom: 3px;
  margin-top: 3px;  
  &:last-child: {
    margin-right: 0;
  }
`;

const DateWrap = styled.span`
  vertical-align: bottom;
`;

export default class EntityListItemMainBottomTargetDate extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    targetDate: PropTypes.string.isRequired,
  };
  render() {
    return (
      <Styled>
        <BottomIconWrap>
          <Icon name="calendar" text />
        </BottomIconWrap>
        <DateWrap>
          {this.props.targetDate}
        </DateWrap>
      </Styled>
    );
  }
}

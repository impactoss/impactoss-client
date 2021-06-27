import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import IconWrap from './IconWrap';

const Styled = styled.span`
  float: left;
  display: inline-block;
  margin-left: 1em;
  color: ${palette('text', 1)};
  margin-top: -2px;
  &:last-child: {
    margin-right: 0;
  }
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemBottom};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.listItemBottom};
  }
`;

const DateWrap = styled.span``;

export default class EntityListItemMainTargetDate extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    targetDate: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Styled>
        <IconWrap>
          <Icon name="calendar" text />
        </IconWrap>
        <DateWrap>
          {this.props.targetDate}
        </DateWrap>
      </Styled>
    );
  }
}

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

const UserWrap = styled.span``;

export default class EntityListItemMainUser extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Styled>
        <IconWrap>
          <Icon name="reminder" text />
        </IconWrap>
        <UserWrap>
          {this.props.user.name}
        </UserWrap>
      </Styled>
    );
  }
}

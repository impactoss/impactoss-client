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
  &:last-child: {
    margin-right: 0;
  }
`;

const UserWrap = styled.span`
  vertical-align: bottom;
`;

export default class EntityListItemMainBottomUser extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Styled>
        <BottomIconWrap>
          <Icon name="reminder" text />
        </BottomIconWrap>
        <UserWrap>
          {this.props.user.name}
        </UserWrap>
      </Styled>
    );
  }
}

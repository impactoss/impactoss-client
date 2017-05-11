/*
 *
 * EntityListSidebarGroupLabel
 *
 */

import React, { PropTypes } from 'react';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

const Styled = styled.div`
  color: ${palette('greyscaleDark', 2)};
  background-color: ${palette('greyscaleLight', 1)};
  padding: 0.5em 2em;
`;
const Right = styled.div`
  color: ${palette('greyscaleDark', 4)};
  float:right;
`;

export default class EntityListSidebarGroupLabel extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
  };

  render() {
    const { label, icon } = this.props;

    return (
      <Styled>
        {label}
        <Right><Icon name={icon} text /></Right>
      </Styled>
    );
  }
}

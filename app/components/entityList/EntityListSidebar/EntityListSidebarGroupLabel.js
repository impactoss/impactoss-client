/*
 *
 * EntityListSidebarGroupLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

const Styled = styled.div`
  color: ${palette('dark', 3)};
  background-color: ${palette('light', 1)};
  padding: 0.5em 2em;
`;
const Right = styled.div`
  color: ${palette('dark', 4)};
  float:right;
`;

export default class EntityListSidebarGroupLabel extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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

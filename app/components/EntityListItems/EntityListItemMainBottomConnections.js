import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import BottomTagGroup from './BottomTagGroup';

const Count = styled.span`
  display: inline-block;
  padding: 3px 7px;
  position: relative;
  top: -2px;
  border-radius: 999px;
  font-size: 0.8em;
  background-color: ${(props) => palette(props.pIndex, 0)};
  color: ${palette('primary', 4)};
`;

export default class EntityListItemMainBottomConnections extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    connections: PropTypes.array.isRequired,
  };

  render() {
    return (
      <BottomTagGroup>
        {
          this.props.connections.map((connection, i) => (
            <span key={i}>
              <Icon name={connection.option.icon} text />
              <Count pIndex={connection.option.style}>{connection.count}</Count>
            </span>
          ))
        }
      </BottomTagGroup>
    );
  }
}

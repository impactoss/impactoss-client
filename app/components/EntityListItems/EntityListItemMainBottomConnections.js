import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Count = styled.span`
  display: inline-block;
  background: #eee;
  color: #333;
  padding: 1px 6px;
  margin: 0 3px;
  border-radius: 999px;
  font-size: 0.8em;
`;

export default class EntityListItemMainBottomConnections extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    connections: PropTypes.array.isRequired,
  };

  render() {
    return (
      <span>
        {
          this.props.connections.map((connection, i) => (
            <span key={i}>
              {connection.option.label}
              <Count>{connection.count}</Count>
            </span>
          ))
        }
      </span>
    );
  }
}

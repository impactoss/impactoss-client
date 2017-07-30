import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import BottomTagGroup from './BottomTagGroup';
import ConnectionPopup from './ConnectionPopup';

export default class EntityListItemMainBottomConnections extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    connections: PropTypes.array.isRequired,
    wrapper: PropTypes.object,
  };

  render() {
    return (
      <BottomTagGroup>
        {
          this.props.connections.map((connection, i) => (
            <span key={i}>
              <Icon name={connection.option.icon} text />
              <ConnectionPopup
                connection={connection}
                wrapper={this.props.wrapper}
              />
            </span>
          ))
        }
      </BottomTagGroup>
    );
  }
}

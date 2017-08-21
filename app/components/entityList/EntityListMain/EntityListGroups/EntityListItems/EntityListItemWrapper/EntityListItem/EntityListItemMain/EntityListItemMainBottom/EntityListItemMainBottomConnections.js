import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import BottomTagGroup from './BottomTagGroup';
import BottomIconWrap from './BottomIconWrap';
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
              <BottomIconWrap>
                <Icon name={connection.option.icon} text />
              </BottomIconWrap>
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

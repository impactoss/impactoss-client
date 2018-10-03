import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/Icon';
import BottomTagGroup from './BottomTagGroup';
import BottomIconWrap from './BottomIconWrap';
import ConnectionPopup from './ConnectionPopup';

const ConnectionWrap = styled.span`
  display: inline-block;
`;

export default class EntityListItemMainBottomConnections extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    connections: PropTypes.array.isRequired,
    wrapper: PropTypes.object,
  };

  render() {
    return (
      <BottomTagGroup>
        {
          this.props.connections.map((connection, i) => {
            const draftEntities = connection.entities.filter((entity) => entity.getIn(['attributes', 'draft']));
            return (
              <ConnectionWrap key={i}>
                <BottomIconWrap>
                  <Icon name={connection.option.icon} text />
                </BottomIconWrap>
                <ConnectionPopup
                  entities={connection.entities.filter((entity) => !entity.getIn(['attributes', 'draft']))}
                  option={connection.option}
                  wrapper={this.props.wrapper}
                />
                { draftEntities.size > 0 &&
                  <ConnectionPopup
                    entities={draftEntities}
                    option={connection.option}
                    wrapper={this.props.wrapper}
                    draft
                  />
                }
              </ConnectionWrap>
            );
          })
        }
      </BottomTagGroup>
    );
  }
}

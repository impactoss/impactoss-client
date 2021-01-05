import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import BottomTagGroup from './BottomTagGroup';
import ConnectionPopup from './ConnectionPopup';

const ConnectionWrap = styled.span`
  display: inline-block;
  margin-right: 10px;
  margin-left: 5px;
  &:last-child {
    margin-right: 0;
  }
  &:first-child {
    margin-left: 0;
  }
`;
const ConnectionLabel = styled.span`
  vertical-align: middle;
  font-size: 12px;
  color: ${palette('text', 1)};
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
            const entitiesTotal = connection.entities ? connection.entities.size : 0;
            return (
              <ConnectionWrap key={i}>
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
                <ConnectionLabel>
                  {connection.option.label(entitiesTotal)}
                </ConnectionLabel>
              </ConnectionWrap>
            );
          })
        }
      </BottomTagGroup>
    );
  }
}

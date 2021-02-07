import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

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
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemBottom};
  padding-top: 2px;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.listItemBottom};
  }
`;
const Styled = styled.div`
  width: 100%;
  display: block;
  border-top: 1px solid ${palette('light', 1)};
  margin-top: 8px;
  margin-bottom: 5px;
  padding-top: 5px;
  @media print {
    border-top: none;
    margin-top: 3px;
    margin-bottom: 2px;
  }
`;

export default class EntityListItemMainConnections extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    connections: PropTypes.array.isRequired,
    wrapper: PropTypes.object,
  };

  render() {
    return (
      <Styled>
        {
          this.props.connections.map((connection, i) => {
            const draftEntities = connection.entities.filter(
              (entity) => entity && entity.getIn(['attributes', 'draft'])
            );
            const entitiesTotal = connection.entities ? connection.entities.size : 0;
            return (
              <ConnectionWrap key={i}>
                <ConnectionPopup
                  entities={connection.entities.filter((entity) => entity && !entity.getIn(['attributes', 'draft']))}
                  option={connection.option}
                  wrapper={this.props.wrapper}
                />
                { draftEntities.size > 0
                  && (
                    <ConnectionPopup
                      entities={draftEntities}
                      option={connection.option}
                      wrapper={this.props.wrapper}
                      draft
                    />
                  )
                }
                <ConnectionLabel>
                  {connection.option.label(entitiesTotal)}
                </ConnectionLabel>
              </ConnectionWrap>
            );
          })
        }
      </Styled>
    );
  }
}

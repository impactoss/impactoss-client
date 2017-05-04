import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';

import EntityListItemMain from './EntityListItemMain';
import EntityListItemExpandable from './EntityListItemExpandable';

const ItemWrapper = styled.span`
  display: inline-block;
  width:${(props) => props.expand ? '50%' : '100%'};
`;

const Item = styled(Component)`
  padding: 1px 0;
  display: table;
  width:100%;
`;

export default class EntityListChildItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    expand: PropTypes.number,
  }

  render() {
    const {
      entity,
      expand,
    } = this.props;

    return (
      <ItemWrapper expand={expand}>
        <Item>
          <EntityListItemMain entity={entity} />
          {entity.expandables &&
            entity.expandables.map((expandable, i) =>
              <EntityListItemExpandable
                key={i}
                label={expandable.label}
                type={expandable.type}
                count={expandable.count}
                info={expandable.info}
                onClick={expandable.onClick}
              />
            )
          }
        </Item>
      </ItemWrapper>
    );
  }
}

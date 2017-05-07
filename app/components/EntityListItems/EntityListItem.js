import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';

import EntityListItemMain from './EntityListItemMain';
import EntityListItemSelect from './EntityListItemSelect';
import EntityListItemExpandable from './EntityListItemExpandable';


const ItemWrapper = styled.span`
  display: inline-block;
  width: ${(props) => props.expand ? '50%' : '100%'};
  vertical-align: top;
`;
const Item = styled(Component)`
  padding: 1px 0;
  display: table;
  width:100%;
`;

class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      entity,
      select,
      checked,
      onSelect,
      expand,
    } = this.props;

    return (
      <ItemWrapper expand={expand}>
        <Item>
          {select &&
            <EntityListItemSelect checked={checked} onSelect={onSelect} />
          }
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


EntityListItem.propTypes = {
  entity: PropTypes.object.isRequired,
  select: PropTypes.bool,
  checked: PropTypes.bool,
  expand: PropTypes.number,
  onSelect: PropTypes.func,
};

EntityListItem.defaultProps = {
  checked: false,
  expand: null,
};

export default EntityListItem;

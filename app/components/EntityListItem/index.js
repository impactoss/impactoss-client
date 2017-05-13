import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component';

import EntityListItemMain from './EntityListItemMain';
import EntityListItemSelect from './EntityListItemSelect';
import EntityListItemExpandable from './EntityListItemExpandable';


const Styled = styled.span`
  display: inline-block;
  width: ${(props) => props.expandNo ? '50%' : '100%'};
  vertical-align: top;
`;
const Item = styled(Component)`
  padding: '1px 0';
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
      expandNo,
      entityIcon,
    } = this.props;

    return (
      <Styled expandNo={expandNo}>
        <Item>
          {select &&
            <EntityListItemSelect checked={checked} onSelect={onSelect} />
          }
          <EntityListItemMain entity={entity} entityIcon={entityIcon} />
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
      </Styled>
    );
  }
}


EntityListItem.propTypes = {
  entity: PropTypes.object.isRequired,
  select: PropTypes.bool,
  checked: PropTypes.bool,
  expandNo: PropTypes.number,
  onSelect: PropTypes.func,
  entityIcon: PropTypes.string,
};

EntityListItem.defaultProps = {
  checked: false,
  expandNo: null,
};

export default EntityListItem;

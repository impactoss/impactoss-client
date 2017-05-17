import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

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
  display: table;
  width:100%;
  background-color: ${palette('primary', 4)};
`;
const MainWrapper = styled(Component)`
  display: table-cell;
  width: ${(props) => props.expandables ? 66 : 100}%;
  border-right: 1px solid ${(props) => props.expandables ? palette('greyscaleLight', 0) : 'transparent'};

`;
const MainInnerWrapper = styled(Component)`
  display: table;
  width: 100%;
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
          <MainWrapper expandables={entity.expandables} >
            <MainInnerWrapper>
              {select &&
                <EntityListItemSelect checked={checked} onSelect={onSelect} />
              }
              <EntityListItemMain entity={entity} entityIcon={entityIcon} />
            </MainInnerWrapper>
          </MainWrapper>
          {entity.expandables &&
            entity.expandables.map((expandable, i, list) =>
              <EntityListItemExpandable
                key={i}
                label={expandable.label}
                type={expandable.type}
                entityIcon={expandable.icon}
                count={expandable.count}
                info={expandable.info}
                onClick={expandable.onClick}
                width={(1 - 0.66) / list.length}
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

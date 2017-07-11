import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
// import { isEqual } from 'lodash/lang';
import { Map } from 'immutable';
import Component from 'components/styled/Component';

import EntityListItemMain from './EntityListItemMain';
import EntityListItemSelect from './EntityListItemSelect';
// import EntityListItemExpandable from './EntityListItemExpandable';


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
  border-right: 1px solid ${(props) => props.expandables ? palette('light', 0) : 'transparent'};

`;
const MainInnerWrapper = styled(Component)`
  display: table;
  width: 100%;
`;

class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return this.props.entity !== nextProps.entity
      || this.props.isSelected !== nextProps.isSelected
      || this.props.expandNo !== nextProps.expandNo;
  }
  // getExpandables = () => {
  //   const {
  //     expandNo,
  //     expandableColumns,
  //     expandableColumns,
  //     onExpand,
  //   } = this.props;
  //   const entity = this.props.entity.toJS()
  //   return expandableColumns && !expandNo
  //     ? expandableColumns.map((column, i) => ({
  //       type: column.type,
  //       icon: column.icon,
  //       label: column.label,
  //       count: column.getCount && column.getCount(entity),
  //       info: column.getInfo && column.getInfo(entity),
  //       onClick: () => onExpand(expandNo > i ? i : i + 1),
  //     }))
  //     : null;
  // }

  render() {
    const {
      entity,
      isManager,
      isSelected,
      onSelect,
      expandNo,
      entityIcon,
      associations,
      taxonomies,
      onTagClick,
      // expandableColumns,
      onEntityClick,
    } = this.props;

    // console.log('EntityListItem.render', entity.get('id'))

    return (
      <Styled expandNo={expandNo}>
        <Item>
          <MainWrapper>
            <MainInnerWrapper>
              {isManager &&
                <EntityListItemSelect checked={isSelected} onSelect={onSelect} />
              }
              <EntityListItemMain
                entity={entity}
                taxonomies={taxonomies}
                entityIcon={entityIcon}
                onTagClick={onTagClick}
                associations={associations}
                onEntityClick={onEntityClick}
              />
            </MainInnerWrapper>
          </MainWrapper>
        </Item>
      </Styled>
    );
  }
}

// {expandableColumns && expandNo > 0 &&
//   expandables.map((expandable, i, list) =>
//     <EntityListItemExpandable
//       key={i}
//       label={expandable.label}
//       type={expandable.type}
//       entityIcon={expandable.icon}
//       count={expandable.count}
//       info={expandable.info}
//       onClick={expandable.onClick}
//       width={(1 - 0.66) / list.length}
//     />
//   )
// }

EntityListItem.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  isManager: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  expandNo: PropTypes.number,
  // expandableColumns: PropTypes.array,
  // expandableColumns: PropTypes.object,
  // onExpand: PropTypes.func,
  entityIcon: PropTypes.string,
  onTagClick: PropTypes.func,
  associations: PropTypes.object,
  onEntityClick: PropTypes.func,
};

EntityListItem.defaultProps = {
  isSelected: false,
  expandNo: null,
};

export default EntityListItem;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Map, List } from 'immutable';

// import { map, forEach } from 'lodash/collection';
// import { isEqual } from 'lodash/lang';

import EntityListItem from './EntityListItem';
// import EntityListNestedList from './EntityListNestedList';
// import EntityListNestedReportList from './EntityListNestedList/EntityListNestedReportList';

const ItemWrapper = styled.div`
  border-top: 1px solid;
  padding: ${(props) => props.separated ? '0.5em 0 2.5em' : '0'};
  border-color: ${(props) => props.separated ? palette('light', 4) : palette('light', 0)};
`;

export class EntityListItemWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getNestedIndicators = (entity) => entity.get('indicators')
    ? entity.get('indicators').reduce((nested, association) =>
      association.get('indicator')
        ? nested.push(association.get('indicator'))
        : nested
    , List())
    : List();

  render() {
    const {
      isManager,
      onEntitySelect,
      expandNo,
      // isExpandable,
      // expandableColumns,
      onExpand,
      entityIcon,
      entityIdsSelected,
      taxonomies,
      onTagClick,
      associations,
      entityLinkTo,
      entity,
    } = this.props;
    // console.log('EntityListItemWrapper.render', entity.id)
    return (
      <ItemWrapper separated={expandNo}>
        <EntityListItem
          entity={entity}
          isManager={isManager}
          isSelected={isManager && entityIdsSelected.includes(entity.get('id'))}
          onSelect={(checked) => onEntitySelect(entity.get('id'), checked)}
          expandNo={expandNo}
          onExpand={onExpand}
          entityIcon={entityIcon}
          taxonomies={taxonomies}
          onTagClick={onTagClick}
          associations={associations}
          entityLinkTo={entityLinkTo}
        />
      </ItemWrapper>
    );
  }
}
//
// {isExpandable && expandNo > 0 && expandableColumns[0].type === 'reports' &&
//   <EntityListNestedReportList
//     entity={entity}
//     entityLinkTo={expandableColumns[0].entityLinkTo}
//   />
// }
// {isExpandable && expandNo > 0 && expandableColumns[0].type === 'indicators' &&
//   <EntityListNestedList
//     entities={this.getNestedIndicators(entity)}
//     entityLinkTo={expandableColumns[0].entityLinkTo}
//     entityIcon={expandableColumns[0].icon}
//     expandNo={expandNo - 1}
//     isExpandable={expandableColumns.length > 1}
//     expandableColumns={expandableColumns.length > 1 ? [expandableColumns[1]] : null}
//     onExpand={onExpand}
//   />
// }

EntityListItemWrapper.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  associations: PropTypes.object,
  isManager: PropTypes.bool,
  onEntitySelect: PropTypes.func,
  entityLinkTo: PropTypes.string,
  onTagClick: PropTypes.func,
  onExpand: PropTypes.func,
  expandNo: PropTypes.number,
  entityIcon: PropTypes.string,
};

export default EntityListItemWrapper;

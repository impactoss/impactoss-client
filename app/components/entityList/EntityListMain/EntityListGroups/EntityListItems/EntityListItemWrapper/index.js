import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Map, List } from 'immutable';

import EntityListItem from './EntityListItem';
import EntityListNestedList from './EntityListNestedList';
import EntityListNestedReportList from './EntityListNestedList/EntityListNestedReportList';

const ItemWrapper = styled.div`
  border-top: 1px solid;
  padding: ${(props) => props.separated ? '0.5em 0 2.5em' : '0'};
  border-color: ${(props) => props.separated ? palette('light', 4) : palette('light', 0)};
`;

export class EntityListItemWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return this.props.expandNo !== nextProps.expandNo
    || this.props.entity !== nextProps.entity
    || this.props.entityIdsSelected !== nextProps.entityIdsSelected;
  }
  render() {
    const {
      isManager,
      onEntitySelect,
      expandNo,
      onExpand,
      entityIcon,
      entityIdsSelected,
      taxonomies,
      onTagClick,
      config,
      onEntityClick,
      entity,
    } = this.props;
    // console.log('EntityListItemWrapper.render')

    return (
      <ItemWrapper separated={expandNo}>
        <EntityListItem
          entity={entity}
          isManager={isManager}
          isSelected={isManager && entityIdsSelected.includes(entity.get('id'))}
          onSelect={(checked) => onEntitySelect(entity.get('id'), checked)}
          onExpand={onExpand}
          expandNo={expandNo}
          entityIcon={entityIcon}
          taxonomies={taxonomies}
          onTagClick={onTagClick}
          config={config}
          onEntityClick={onEntityClick}
        />
        {config.expandableColumns && expandNo > 0 && entity.get('expanded') && entity.get('expanded') !== 'reports' &&
          <EntityListNestedList
            entities={
              entity.get(entity.get('expanded'))
              ? entity.get(entity.get('expanded')).toList()
              : List()
            }
            config={config}
            nestLevel={1}
            expandNo={expandNo}
            onExpand={onExpand}
            onEntityClick={onEntityClick}
          />
        }
        {expandNo > 0 && entity.get('expanded') && entity.get('expanded') === 'reports' && entity.get('reports') &&
          <EntityListNestedReportList
            reports={entity.get('reports').toList()}
            dates={entity.get('dates')}
            onEntityClick={onEntityClick}
          />
        }
      </ItemWrapper>
    );
  }
}

EntityListItemWrapper.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  config: PropTypes.object,
  isManager: PropTypes.bool,
  onEntityClick: PropTypes.func,
  onEntitySelect: PropTypes.func,
  onTagClick: PropTypes.func,
  onExpand: PropTypes.func,
  expandNo: PropTypes.number,
  entityIcon: PropTypes.string,
};

export default EntityListItemWrapper;

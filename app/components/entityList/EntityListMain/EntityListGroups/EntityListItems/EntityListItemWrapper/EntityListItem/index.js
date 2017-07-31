import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { find } from 'lodash/collection';
import { Map } from 'immutable';
import asList from 'utils/as-list';
import Component from 'components/styled/Component';

import EntityListItemMain from './EntityListItemMain';
import EntityListItemSelect from './EntityListItemSelect';
import EntityListItemExpandable from './EntityListItemExpandable';


const Styled = styled.span`
  display: inline-block;
  width: ${(props) => props.expanded ? 50 : 100}%;
  vertical-align: top;
`;
const Item = styled(Component)`
  display: table;
  width:100%;
  background-color: ${palette('primary', 4)};
`;
const MainWrapper = styled(Component)`
  display: table-cell;
  width: ${(props) => props.expandable ? 66 : 100}%;
  border-right: 1px solid ${(props) => props.expandable ? palette('light', 0) : 'transparent'};
`;
const MainInnerWrapper = styled(Component)`
  display: table;
  width: 100%;
`;

class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return this.props.entity !== nextProps.entity
      || this.props.isSelected !== nextProps.isSelected
      || this.props.wrapper !== nextProps.wrapper
      || this.props.expandNo !== nextProps.expandNo;
  }

  render() {
    const {
      entity,
      isManager,
      isSelected,
      onSelect,
      entityIcon,
      config,
      taxonomies,
      onExpand,
      onEntityClick,
      expandNo,
      entityPath,
      connections,
    } = this.props;

    return (
      <Styled expanded={expandNo > 0}>
        <Item>
          <MainWrapper expandable={entity.get('expandable')}>
            <MainInnerWrapper>
              {isManager &&
                <EntityListItemSelect checked={isSelected} onSelect={onSelect} />
              }
              <EntityListItemMain
                entity={entity}
                taxonomies={taxonomies}
                connections={connections}
                entityIcon={entityIcon}
                config={config}
                entityPath={entityPath}
                onEntityClick={onEntityClick}
                wrapper={this.props.wrapper}
              />
            </MainInnerWrapper>
          </MainWrapper>
          {
            entity.get('expandable') &&
            asList(entity.get('expandable')).map((attribute, i, list) =>
              <EntityListItemExpandable
                key={i}
                column={find(config.expandableColumns, (col) => col.type === attribute)}
                count={entity.get(attribute) ? entity.get(attribute).size : 0}
                dates={attribute === 'reports' ? entity.get('dates').toJS() : null}
                onClick={() => onExpand(expandNo > i ? i : i + 1)}
                width={(1 - 0.66) / list.size}
              />
            )
          }
        </Item>
      </Styled>
    );
  }
}

EntityListItem.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  isManager: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  expandNo: PropTypes.number,
  onExpand: PropTypes.func,
  entityIcon: PropTypes.func,
  entityPath: PropTypes.string,
  config: PropTypes.object,
  onEntityClick: PropTypes.func,
  wrapper: PropTypes.object,
};

EntityListItem.defaultProps = {
  isSelected: false,
  expandNo: 0,
};

export default EntityListItem;

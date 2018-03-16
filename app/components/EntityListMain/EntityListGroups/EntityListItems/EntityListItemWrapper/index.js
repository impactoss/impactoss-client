import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Map, List } from 'immutable';

import EntityListItem from 'components/EntityListItem';
import EntityListNestedList from 'components/EntityListNestedList';
import EntityListNestedReportList from 'components/EntityListNestedList/EntityListNestedReportList';
import EntityListNestedNoItem from 'components/EntityListNestedList/EntityListNestedItem/EntityListNestedNoItem';

const ItemWrapper = styled.div`
  border-top: 1px solid;
  padding: ${(props) => props.separated ? '5px 0 10px' : '0'};
  border-color: ${(props) => props.separated ? palette('light', 3) : palette('light', 0)};
`;

export class EntityListItemWrapper extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { wrapper: null };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.expandNo !== nextProps.expandNo
    || this.props.entity !== nextProps.entity
    || this.props.errors !== nextProps.errors
    || this.props.entityIdsSelected !== nextProps.entityIdsSelected
    || (!this.props.simulate && this.state.wrapper !== nextState.wrapper);
  }
  render() {
    const {
      isManager,
      isContributor,
      onEntitySelect,
      expandNo,
      onExpand,
      entityIcon,
      entityIdsSelected,
      taxonomies,
      connections,
      config,
      onEntityClick,
      entity,
      entityPath,
      isConnection,
    } = this.props;
    return (
      <ItemWrapper
        separated={expandNo}
        innerRef={(node) => {
          if (!this.props.simulate && !this.state.wrapper) {
            this.setState({ wrapper: node });
          }
        }}
      >
        { (this.props.simulate || this.state.wrapper) &&
          <div>
            <EntityListItem
              entity={entity}
              error={this.props.errors ? this.props.errors.get(entity.get('id')) : null}
              onDismissError={this.props.onDismissError}
              isManager={isManager}
              isConnection={isConnection}
              isSelected={isManager && entityIdsSelected.includes(entity.get('id'))}
              onSelect={(checked) => onEntitySelect(entity.get('id'), checked)}
              onExpand={onExpand}
              expandNo={expandNo}
              entityIcon={entityIcon}
              taxonomies={taxonomies}
              connections={connections}
              config={config}
              onEntityClick={onEntityClick}
              entityPath={entityPath}
              wrapper={this.state.wrapper}
            />
            {config && config.expandableColumns
              && expandNo > 0
              && entity.get('expanded')
              && entity.get('expanded') !== 'reports'
              && (!entity.get(entity.get('expanded')) || entity.get(entity.get('expanded')).size === 0) &&
              <EntityListNestedNoItem type={entity.get('expanded')} nestLevel={1} />
            }
            {config && config.expandableColumns
              && expandNo > 0
              && entity.get('expanded')
              && entity.get('expanded') !== 'reports' &&
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
                isContributor={isContributor}
              />
            }
            {expandNo > 0
              && entity.get('expanded')
              && entity.get('expanded') === 'reports'
              && entity.get('reports') &&
              <EntityListNestedReportList
                reports={entity.get('reports').toList()}
                dates={entity.get('dates')}
                onEntityClick={onEntityClick}
                isContributor={isContributor}
                nestLevel={1}
              />
            }
          </div>
        }
      </ItemWrapper>
    );
  }
}

EntityListItemWrapper.propTypes = {
  entity: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  config: PropTypes.object,
  isManager: PropTypes.bool,
  isContributor: PropTypes.bool,
  onEntityClick: PropTypes.func,
  onEntitySelect: PropTypes.func,
  onExpand: PropTypes.func,
  onDismissError: PropTypes.func,
  expandNo: PropTypes.number,
  entityPath: PropTypes.string,
  entityIcon: PropTypes.func,
  simulate: PropTypes.bool,
  isConnection: PropTypes.bool,
};

export default EntityListItemWrapper;

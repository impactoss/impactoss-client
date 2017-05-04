/*
 *
 * EntityListSidebar
 *
 */
import React, { PropTypes } from 'react';
import styled from 'styled-components';

import EntityListSidebarFilters from './EntityListSidebarFilters';
import EntityListSidebarEdit from './EntityListSidebarEdit';

const Component = styled.div`
  position: absolute;
  top:0;
  width:300px;
  bottom:0;
  background:#fff;
  z-index:100;
`;
const Header = styled.div`
  background: #ccc;
`;
const Main = styled.div``;

const Button = styled.button`
  font-weight:${(props) => props.active ? 'bold' : 'normal'};
`;

const ListEntitiesEmpty = styled.div``;

export default class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    canEdit: PropTypes.bool,
    hasEntities: PropTypes.bool,
    hasSelected: PropTypes.bool,
    panelGroups: PropTypes.object,
    formOptions: PropTypes.object,
    formModel: PropTypes.string,
    filtersPanel: PropTypes.string,
    editPanel: PropTypes.string,
    activePanel: PropTypes.string,
    onShowForm: PropTypes.func.isRequired,
    onHideForm: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired,
    onPanelSelect: PropTypes.func.isRequired,
  };

  getSidebarOptions= (filtersPanel, editPanel) => ([
    { label: 'Filter list', panel: filtersPanel },
    { label: 'Edit list', panel: editPanel },
  ]);

  render() {
    const {
      panelGroups,
      formOptions,
      formModel,
      onShowForm,
      onHideForm,
      onAssign,
      hasEntities,
      hasSelected,
      canEdit,
      filtersPanel,
      editPanel,
      activePanel,
      onPanelSelect,
    } = this.props;

    return (
      <Component>
        <Header>
          {canEdit && this.getSidebarOptions(filtersPanel, editPanel).map((option, key) =>
            (
              <Button
                key={key}
                active={option.panel === activePanel}
                onClick={() => onPanelSelect(option.panel)}
              >
                {option.label}
              </Button>
            )
          )}
          {!canEdit &&
            <strong>Filter List</strong>
          }
        </Header>
        <Main>
          { activePanel === filtersPanel &&
            <EntityListSidebarFilters
              filterGroups={panelGroups}
              formOptions={formOptions}
              formModel={formModel}
              onShowFilterForm={onShowForm}
              onHideFilterForm={onHideForm}
            />
          }
          { activePanel === editPanel && hasSelected && hasEntities &&
            <EntityListSidebarEdit
              editGroups={panelGroups}
              formOptions={formOptions}
              formModel={formModel}
              onShowEditForm={onShowForm}
              onHideEditForm={onHideForm}
              onAssign={onAssign}
            />
          }
          { activePanel === editPanel && !hasEntities &&
            <ListEntitiesEmpty>
               No entities found
            </ListEntitiesEmpty>
          }
          { activePanel === editPanel && hasEntities && !hasSelected &&
            <ListEntitiesEmpty>
              Please select one or more entities for edit options
            </ListEntitiesEmpty>
          }
        </Main>
      </Component>
    );
  }
}

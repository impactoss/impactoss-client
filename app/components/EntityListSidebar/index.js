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

const ListEntitiesEmpty = styled.div``;

export default class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    options: PropTypes.array,
    isFilterPanel: PropTypes.bool,
    isEditPanel: PropTypes.bool,
    hasEntities: PropTypes.bool,
    hasSelected: PropTypes.bool,
    panelGroups: PropTypes.object,
    formOptions: PropTypes.object,
    formModel: PropTypes.string,
    onShowForm: PropTypes.func.isRequired,
    onHideForm: PropTypes.func.isRequired,
    onAssign: PropTypes.func.isRequired,
  };

  renderOptions = () => this.props.options.map((option, key) =>
    (<button key={key} onClick={option.onClick}>{option.label}</button>)
  );

  render() {
    const {
      isFilterPanel,
      isEditPanel,
      panelGroups,
      formOptions,
      formModel,
      onShowForm,
      onHideForm,
      onAssign,
      hasEntities,
      hasSelected,
    } = this.props;

    return (
      <Component>
        <Header>
          {this.renderOptions()}
        </Header>
        <Main>
          { isFilterPanel &&
            <EntityListSidebarFilters
              filterGroups={panelGroups}
              formOptions={formOptions}
              formModel={formModel}
              onShowFilterForm={onShowForm}
              onHideFilterForm={onHideForm}
            />
          }
          { isEditPanel && hasSelected && hasEntities &&
            <EntityListSidebarEdit
              editGroups={panelGroups}
              formOptions={formOptions}
              formModel={formModel}
              onShowEditForm={onShowForm}
              onHideEditForm={onHideForm}
              onAssign={onAssign}
            />
          }
          { isEditPanel && !hasEntities &&
            <ListEntitiesEmpty>
               No entities found
            </ListEntitiesEmpty>
          }
          { isEditPanel && hasEntities && !hasSelected &&
            <ListEntitiesEmpty>
              Please select one or more entities for edit options
            </ListEntitiesEmpty>
          }
        </Main>
      </Component>
    );
  }
}

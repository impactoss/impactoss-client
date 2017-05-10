/*
 *
 * EntityListSidebar
 *
 */
import React, { PropTypes } from 'react';
import styled from 'styled-components';

import {
  FILTERS_PANEL,
  EDIT_PANEL,
} from 'containers/App/constants';

import {
  FILTER_FORM_MODEL,
  EDIT_FORM_MODEL,
} from 'containers/EntityListForm/constants';

import EntityListSidebarFilters from './EntityListSidebarFilters';
import EntityListSidebarEdit from './EntityListSidebarEdit';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

import messages from './messages';

const Styled = styled.div`
`;
const Header = styled.div`
  background: #ccc;
`;
const Main = styled.div``;

const Button = styled.button`
  font-weight:${(props) => props.active ? 'bold' : 'normal'};
`;

const ListEntitiesEmpty = styled.div``;

export class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      activeOption: null,
    };
  }
  componentWillMount() {
    this.setState({ activeOption: null });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePanel !== this.props.activePanel || nextProps.location.key !== this.props.location.key) {
      // close and reset option panel
      this.setState({ activeOption: null });
    }
  }
  onShowForm = (option) => {
    this.setState({ activeOption: option });
  };

  onHideForm = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ activeOption: null });
  };

  getSidebarOptions = () => ([
    { label: 'Filter list', panel: FILTERS_PANEL },
    { label: 'Edit list', panel: EDIT_PANEL },
  ]);

  render() {
    const {
      filters,
      edits,
      taxonomies,
      connections,
      connectedTaxonomies,
      entitiesSorted,
      entitiesSelected,
      onAssign,
      canEdit,
      activePanel,
      onPanelSelect,
      location,
    } = this.props;
    const activeOption = this.state.activeOption;
    const hasSelected = entitiesSelected && entitiesSelected.length > 0;
    const hasEntities = entitiesSorted && entitiesSorted.length > 0;
    const formModel = activePanel === FILTERS_PANEL ? FILTER_FORM_MODEL : EDIT_FORM_MODEL;

    let panelGroups = null;
    let formOptions = null;
    if (activePanel === FILTERS_PANEL) {
      panelGroups = makeFilterGroups(
        filters,
        taxonomies,
        connections,
        connectedTaxonomies,
        activeOption,
        {
          attributes: this.context.intl.formatMessage(messages.filterGroupLabel.attributes),
          taxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.filterGroupLabel.connections),
          connectedTaxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
        }
      );
      if (activeOption) {
        formOptions = makeActiveFilterOptions(
          entitiesSorted,
          filters,
          activeOption,
          location,
          taxonomies,
          connections,
          connectedTaxonomies,
          {
            titlePrefix: this.context.intl.formatMessage(messages.filterFormTitlePrefix),
            without: this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
          }
        );
      }
    } else if (activePanel === EDIT_PANEL && canEdit && entitiesSelected.length > 0) {
      panelGroups = makeEditGroups(
        edits,
        taxonomies,
        connections,
        activeOption,
        {
          attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
          taxonomies: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
        }
      );
      if (activeOption) {
        formOptions = makeActiveEditOptions(
          entitiesSelected,
          edits,
          activeOption,
          taxonomies,
          connections,
          {
            title: `${this.context.intl.formatMessage(messages.editFormTitlePrefix)} ${entitiesSelected.length} ${this.context.intl.formatMessage(messages.editFormTitlePostfix)}`,
          }
        );
      }
    }
    return (
      <Styled>
        <Header>
          {canEdit && this.getSidebarOptions().map((option, key) =>
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
          { activePanel === FILTERS_PANEL &&
            <EntityListSidebarFilters
              filterGroups={panelGroups}
              formOptions={formOptions}
              formModel={formModel}
              onShowFilterForm={this.onShowForm}
              onHideFilterForm={this.onHideForm}
            />
          }
          { activePanel === EDIT_PANEL && hasSelected && hasEntities &&
            <EntityListSidebarEdit
              editGroups={panelGroups}
              formOptions={formOptions}
              formModel={formModel}
              onShowEditForm={this.onShowForm}
              onHideEditForm={this.onHideForm}
              onAssign={(associations) => {
                // close and reset option panel
                this.setState({ activeOption: null });
                onAssign(associations, activeOption);
              }}
            />
          }
          { activePanel === EDIT_PANEL && !hasEntities &&
            <ListEntitiesEmpty>
               No entities found
            </ListEntitiesEmpty>
          }
          { activePanel === EDIT_PANEL && hasEntities && !hasSelected &&
            <ListEntitiesEmpty>
              Please select one or more entities for edit options
            </ListEntitiesEmpty>
          }
        </Main>
      </Styled>
    );
  }
}
EntityListSidebar.propTypes = {
  location: PropTypes.object,
  canEdit: PropTypes.bool,
  filters: PropTypes.object,
  edits: PropTypes.object,
  taxonomies: PropTypes.object,
  connections: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  entitiesSorted: PropTypes.array,
  entitiesSelected: PropTypes.array,
  activePanel: PropTypes.string,
  onAssign: PropTypes.func.isRequired,
  onPanelSelect: PropTypes.func.isRequired,
};

EntityListSidebar.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default EntityListSidebar;

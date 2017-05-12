/*
 *
 * EntityListSidebar
 *
 */
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { FILTERS_PANEL, EDIT_PANEL } from 'containers/App/constants';
import { FILTER_FORM_MODEL, EDIT_FORM_MODEL } from 'containers/EntityListForm/constants';

import Scrollable from 'components/basic/Scrollable';
import ButtonToggle from 'components/buttons/ButtonToggle';
import SupTitle from 'components/SupTitle';

import EntityListForm from 'containers/EntityListForm';
import appMessages from 'containers/App/messages';

import EntityListSidebarGroups from './EntityListSidebarGroups';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

import messages from './messages';

const Styled = styled.div``;
const Main = styled.div``;
const Header = styled.div`
  padding: 3em 2em 1em;
  background-color: ${palette('greyscaleLight', 2)}
`;
const ListEntitiesEmpty = styled.div`
  padding: 3em 2em 1em;
`;

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
    this.setState({ activeOption: option.active ? null : option });
  };

  onHideForm = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ activeOption: null });
  };

  getSidebarButtons = () => ([
    {
      label: this.context.intl.formatMessage(messages.header.filterButton),
      panel: FILTERS_PANEL,
      icon: 'filter',
    },
    {
      label: this.context.intl.formatMessage(messages.header.editButton),
      panel: EDIT_PANEL,
      icon: 'edit',
    },
  ]);

  getFormButtons = (activePanel) => {
    const buttons = [{
      type: 'simple',
      title: (activePanel === EDIT_PANEL)
        ? this.context.intl.formatMessage(appMessages.buttons.cancel)
        : this.context.intl.formatMessage(appMessages.buttons.close),
      onClick: this.onHideForm,
    }];
    if (activePanel === EDIT_PANEL) {
      buttons.push({
        type: 'primary',
        title: this.context.intl.formatMessage(appMessages.buttons.assign),
        submit: true,
        // TODO consider making button inactive when form unchanged
      });
    }
    return buttons;
  }

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
    if (activePanel === FILTERS_PANEL) {
      panelGroups = makeFilterGroups(
        filters, taxonomies, connections, connectedTaxonomies, activeOption, {
          attributes: this.context.intl.formatMessage(messages.filterGroupLabel.attributes),
          taxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.filterGroupLabel.connections),
          connectedTaxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
        }
      );
    } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
      panelGroups = makeEditGroups(
        edits, taxonomies, connections, activeOption, {
          attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
          taxonomies: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
        }
      );
    }
    let formOptions = null;
    if (activeOption) {
      if (activePanel === FILTERS_PANEL) {
        formOptions = makeActiveFilterOptions(
          entitiesSorted, filters, activeOption, location, taxonomies, connections, connectedTaxonomies, {
            titlePrefix: this.context.intl.formatMessage(messages.filterFormTitlePrefix),
            without: this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
          }
        );
      } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
        formOptions = makeActiveEditOptions(
          entitiesSelected, edits, activeOption, taxonomies, connections, {
            title: `${this.context.intl.formatMessage(messages.editFormTitlePrefix)} ${entitiesSelected.length} ${this.context.intl.formatMessage(messages.editFormTitlePostfix)}`,
          }
        );
      }
    }

    return (
      <Styled>
        <Scrollable>
          <Header>
            {canEdit &&
              <ButtonToggle
                options={this.getSidebarButtons()}
                activePanel={activePanel}
                onSelect={onPanelSelect}
              />}
            {!canEdit &&
              <SupTitle title={this.context.intl.formatMessage(messages.header.filter)} />
            }
          </Header>
          <Main>
            { (activePanel === FILTERS_PANEL || (activePanel === EDIT_PANEL && hasSelected && hasEntities)) &&
              <EntityListSidebarGroups
                groups={panelGroups}
                onShowForm={this.onShowForm}
              />
            }
            { activePanel === EDIT_PANEL && !hasEntities &&
              <ListEntitiesEmpty>
                <FormattedMessage {...messages.entitiesNotFound} />
              </ListEntitiesEmpty>
            }
            { activePanel === EDIT_PANEL && hasEntities && !hasSelected &&
              <ListEntitiesEmpty>
                <FormattedMessage {...messages.entitiesNotSelected} />
              </ListEntitiesEmpty>
            }
          </Main>
        </Scrollable>
        { formOptions &&
          <EntityListForm
            model={formModel}
            formOptions={formOptions}
            buttons={this.getFormButtons(activePanel)}
            onCancel={this.onHideForm}
            onSubmit={activePanel === EDIT_PANEL
              ? (associations) => {
                // close and reset option panel
                this.setState({ activeOption: null });
                onAssign(associations, activeOption);
              }
              : null
            }
          />
        }
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

/*
 *
 * EntityListSidebar
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { Map, List, fromJS } from 'immutable';

import { isEqual } from 'lodash/lang';

import { FILTERS_PANEL, EDIT_PANEL, VIEWPORTS } from 'containers/App/constants';
import { FILTER_FORM_MODEL, EDIT_FORM_MODEL } from 'containers/EntityListForm/constants';

import Scrollable from 'components/styled/Scrollable';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonToggle from 'components/buttons/ButtonToggle';
import ButtonDefault from 'components/buttons/ButtonDefault';
import SupTitle from 'components/SupTitle';

import EntityListForm from 'containers/EntityListForm';
import appMessages from 'containers/App/messages';
import Sidebar from 'components/styled/Sidebar';
import SidebarHeader from 'components/styled/SidebarHeader';

import EntityListSidebarGroups from './EntityListSidebarGroups';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

import messages from './messages';

// const Styled = styled.div``;
// const Main = styled.div``;
const ScrollableWrapper = styled(Scrollable)`
  background-color: ${palette('aside', 0)};
`;

const ListEntitiesEmpty = styled.div`
  font-size: 1.2em;
  padding: 1.5em;
  color: ${palette('text', 1)};
`;

const ToggleShow = styled(ButtonDefault)`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 0.75em 1em;
  letter-spacing: 0;
  border-radius: 0;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
  font-size: 0.85em;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: ${(props) => props.theme.sizes.aside.width.large}px;
  }
`;

const ToggleHide = styled(Button)`
  position: absolute;
  right:0;
  top:0;
`;
// color: ${palette('link', 3)};
// &:hover {
//   color: ${palette('linkHover', 3)};
// }
const SidebarWrapper = styled.div`
  ${(props) => props.sidebarAbsolute
    ? 'position: absolute;width: 100%;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(0,0,0,0.2); z-index: 98;'
    : ''
  }
`;

const STATE_INITIAL = {
  activeOption: null,
  expandedGroups: {
    taxonomies: true,
    connectedTaxonomies: true,
    connections: false,
    attributes: false,
  },
  visible: false,
  viewport: null,
};

export class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = STATE_INITIAL;
  }
  componentWillMount() {
    this.setState(STATE_INITIAL);
  }
  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.activePanel !== this.props.activePanel) {
      // close and reset option panel
      this.setState({ activeOption: null });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate')
    // console.log('locationQuery', isEqual(this.props.locationQuery, nextProps.locationQuery))
    // console.log('locationQuery', this.props.locationQuery === nextProps.locationQuery)
    // console.log('locationQuery.where',!isEqual(this.props.locationQuery.where, nextProps.locationQuery.where))
    // console.log('locationQuery.without',!isEqual(this.props.locationQuery.without, nextProps.locationQuery.without))
    // console.log('locationQuery.cat',!isEqual(this.props.locationQuery.cat, nextProps.locationQuery.cat))
    // console.log('locationQuery.catx',!isEqual(this.props.locationQuery.catx, nextProps.locationQuery.catx))
    // console.log('entityIdsSelected',this.props.entityIdsSelected !== nextProps.entityIdsSelected)
    // console.log('activePanel',this.props.activePanel !== nextProps.activePanel)
    // console.log('state',!isEqual(this.state, nextState));
    // TODO consider targeting specific query params, eg where, without, cat, catx but also recommendations, etc
    if (nextProps.listUpdating && isEqual(this.state, nextState)) {
      return false;
    }
    if (this.props.listUpdating && !nextProps.listUpdating) {
      return true;
    }
    return this.props.locationQuery !== nextProps.locationQuery
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.activePanel !== nextProps.activePanel
      || this.props.taxonomies !== nextProps.taxonomies
      || this.props.connections !== nextProps.connections
      || !isEqual(this.state, nextState);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onShowForm = (option) => {
    this.setState({ activeOption: option.active ? null : option });
  };
  onShowSidebar = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ visible: true });
  };
  onHideSidebar = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.onHideForm(evt);
    this.setState({ visible: false });
  };

  onHideForm = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ activeOption: null });
  };

  onToggleGroup = (groupId, expanded) => {
    const expandedGroups = { ...this.state.expandedGroups };
    expandedGroups[groupId] = expanded;
    this.setState({
      expandedGroups,
      activeOption: null,
    });
  }

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

  getFormButtons = (activeOption) => [
    activeOption.create
    ? {
      type: 'addFromMultiselect',
      position: 'left',
      onClick: () => this.props.onCreateOption(activeOption.create),
    }
    : null,
    {
      type: 'simple',
      title: this.context.intl.formatMessage(appMessages.buttons.cancel),
      onClick: this.onHideForm,
    },
    {
      type: 'primary',
      title: this.context.intl.formatMessage(appMessages.buttons.assign),
      submit: true,
    },
  ];

  updateViewport() {
    let viewport = VIEWPORTS.MOBILE;
    if (window.innerWidth >= parseInt(this.props.theme.breakpoints.large, 10)) {
      viewport = VIEWPORTS.LARGE;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.medium, 10)) {
      viewport = VIEWPORTS.MEDIUM;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.small, 10)) {
      viewport = VIEWPORTS.SMALL;
    }
    this.setState({ viewport });
  }

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
  };

  render() {
    const {
      config,
      onUpdate,
      hasUserRole,
      canEdit,
      activePanel,
      onPanelSelect,
      entities,
      locationQuery,
      taxonomies,
      connectedTaxonomies,
      connections,
      entityIdsSelected,
    } = this.props;
    const activeOption = this.state.activeOption;

    const hasSelected = entityIdsSelected && entityIdsSelected.size > 0;
    const hasEntities = entities && entities.size > 0;
    const formModel = activePanel === FILTERS_PANEL ? FILTER_FORM_MODEL : EDIT_FORM_MODEL;

    let panelGroups = null;
    if (activePanel === FILTERS_PANEL) {
      panelGroups = makeFilterGroups(
        config,
        taxonomies,
        connectedTaxonomies,
        activeOption,
        hasUserRole,
        {
          attributes: this.context.intl.formatMessage(messages.filterGroupLabel.attributes),
          taxonomyGroup: this.context.intl.formatMessage(messages.filterGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.filterGroupLabel.connections),
          connectedTaxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
          taxonomies: (taxId) => this.context.intl.formatMessage(appMessages.entities.taxonomies[taxId].plural),
        },
      );
    } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
      panelGroups = makeEditGroups(
        config,
        taxonomies,
        activeOption,
        hasUserRole,
        {
          attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
          taxonomyGroup: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
          taxonomies: (taxId) => this.context.intl.formatMessage(appMessages.entities.taxonomies[taxId].plural),
        },
      );
    }
    let formOptions = null;
    if (activeOption) {
      if (activePanel === FILTERS_PANEL) {
        formOptions = makeActiveFilterOptions(
          entities,
          config,
          activeOption,
          locationQuery,
          taxonomies,
          connections,
          connectedTaxonomies,
          {
            titlePrefix: this.context.intl.formatMessage(messages.filterFormTitlePrefix),
            without: this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
          },
          this.context.intl
        );
      } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
        const entitiesSelected = entities.filter((entity) => entityIdsSelected.includes(entity.get('id')));
        formOptions = makeActiveEditOptions(
          entitiesSelected,
          config,
          activeOption,
          taxonomies,
          connections,
          connectedTaxonomies,
          {
            title: `${this.context.intl.formatMessage(messages.editFormTitlePrefix)} ${entitiesSelected.size} ${this.context.intl.formatMessage(messages.editFormTitlePostfix)}`,
          },
          this.context.intl
        );
      }
    }
    return (
      <div>
        { (!this.state.visible && this.state.viewport < VIEWPORTS.LARGE) &&
          <ToggleShow onClick={this.onShowSidebar}>
            { canEdit &&
              <FormattedMessage {...messages.sidebarToggle.showFilterEdit} />
            }
            { !canEdit &&
              <FormattedMessage {...messages.sidebarToggle.showFilter} />
            }
          </ToggleShow>
        }
        { (this.state.visible || this.state.viewport === VIEWPORTS.LARGE) &&
          <SidebarWrapper
            sidebarAbsolute={this.state.viewport < VIEWPORTS.LARGE}
            onClick={this.onHideSidebar}
          >
            <Sidebar onClick={(evt) => evt.stopPropagation()}>
              <ScrollableWrapper>
                <SidebarHeader hasButtons={canEdit}>
                  {canEdit &&
                    <ButtonToggle
                      options={this.getSidebarButtons()}
                      activePanel={activePanel}
                      onSelect={onPanelSelect}
                    />}
                  {!canEdit &&
                    <SupTitle title={this.context.intl.formatMessage(messages.header.filter)} />
                  }
                  { this.state.viewport < VIEWPORTS.LARGE &&
                    <ToggleHide onClick={this.onHideSidebar} >
                      <Icon name="close" />
                    </ToggleHide>
                  }
                </SidebarHeader>
                <div>
                  { (activePanel === FILTERS_PANEL || (activePanel === EDIT_PANEL && hasSelected && hasEntities)) &&
                    <EntityListSidebarGroups
                      groups={fromJS(panelGroups)}
                      onShowForm={this.onShowForm}
                      onToggleGroup={this.onToggleGroup}
                      expanded={this.state.expandedGroups}
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
                </div>
              </ScrollableWrapper>
            </Sidebar>
          </SidebarWrapper>
        }
        { formOptions &&
          <EntityListForm
            model={formModel}
            activeOptionId={activeOption.optionId}
            formOptions={formOptions}
            buttons={activePanel === EDIT_PANEL
              ? this.getFormButtons(activeOption)
              : null
            }
            onCancel={this.onHideForm}
            showCancelButton={(activePanel === FILTERS_PANEL)}
            onSelect={() => {
              if (activePanel === FILTERS_PANEL) {
                this.onHideForm();
                this.onHideSidebar();
              }
            }}
            onSubmit={activePanel === EDIT_PANEL
              ? (associations) => {
                // close and reset option panel
                this.setState({ activeOption: null });
                onUpdate(associations, activeOption);
              }
              : null
            }
          />
        }
      </div>
    );
  }
}
EntityListSidebar.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  canEdit: PropTypes.bool,
  hasUserRole: PropTypes.object,
  config: PropTypes.object,
  activePanel: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onPanelSelect: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func.isRequired,
  listUpdating: PropTypes.bool,
  theme: PropTypes.object,
};

EntityListSidebar.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default withTheme(EntityListSidebar);

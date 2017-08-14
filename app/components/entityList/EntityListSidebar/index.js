/*
 *
 * EntityListSidebar
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Map, List } from 'immutable';

import { isEqual } from 'lodash/lang';

import { FILTERS_PANEL, EDIT_PANEL } from 'containers/App/constants';
import { FILTER_FORM_MODEL, EDIT_FORM_MODEL } from 'containers/EntityListForm/constants';

import Scrollable from 'components/styled/Scrollable';
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
const ScrollableWrapper = styled(Scrollable)`
  background-color: ${palette('light', 0)};
`;
const Header = styled.div`
  padding: 3em 2em 1em;
  background-color: ${palette('light', 2)};
`;
const ListEntitiesEmpty = styled.div`
  font-size: 1.2em;
  padding: 1.5em;
  color: ${palette('light', 4)};
  font-weight: 500;
`;

export class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      activeOption: null,
    };
  }
  componentWillMount() {
    // console.log('componentWIllMount')
    this.setState({ activeOption: null });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activePanel !== this.props.activePanel) {
      // close and reset option panel
      // console.log('componentWillReceiveProps')
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
    return this.props.locationQuery !== nextProps.locationQuery
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.activePanel !== nextProps.activePanel
      || this.props.taxonomies !== nextProps.taxonomies
      || this.props.connections !== nextProps.connections
      || !isEqual(this.state, nextState);
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

  render() {
    const {
      config,
      onAssign,
      canEdit,
      activePanel,
      onPanelSelect,
      formatLabel,
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
        {
          attributes: this.context.intl.formatMessage(messages.filterGroupLabel.attributes),
          taxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.filterGroupLabel.connections),
          connectedTaxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
        },
        formatLabel
      );
    } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
      panelGroups = makeEditGroups(
        config,
        taxonomies,
        activeOption,
        {
          attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
          taxonomies: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
          connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
        },
        formatLabel
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
          formatLabel,
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
          }
        );
      }
    }

    return (
      <Styled>
        <ScrollableWrapper>
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
        </ScrollableWrapper>
        { formOptions &&
          <EntityListForm
            model={formModel}
            activeOptionId={activeOption.optionId}
            formOptions={formOptions}
            buttons={activePanel === EDIT_PANEL
              ? this.getFormButtons(activeOption)
              : null
            }
            onCancel={(activePanel === FILTERS_PANEL) ? this.onHideForm : null}
            onSelect={() => {
              if (activePanel === FILTERS_PANEL) {
                this.onHideForm();
              }
            }}
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
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  canEdit: PropTypes.bool,
  config: PropTypes.object,
  activePanel: PropTypes.string,
  onAssign: PropTypes.func.isRequired,
  onPanelSelect: PropTypes.func.isRequired,
  formatLabel: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func.isRequired,
};

EntityListSidebar.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSidebar;

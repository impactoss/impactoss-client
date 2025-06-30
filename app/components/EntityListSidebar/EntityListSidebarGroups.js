/*
 *
 * EntityListSidebarGroups
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import EntityListSidebarGroupLabel from './EntityListSidebarGroupLabel';
import EntityListSidebarOption from './EntityListSidebarOption';

const Group = styled.div``;

class EntityListSidebarGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { groups, formOptions } = this.props;
    return (
      <div>
        {groups && groups.entrySeq().map(([groupId, group]) => group.get('options') && group.get('options').size > 0
          ? (
            <Group key={groupId} expanded={this.props.expanded[groupId]}>
              <EntityListSidebarGroupLabel
                label={group.get('label')}
                icon={group.get('icon') || group.get('id')}
                expanded={this.props.expanded[groupId]}
                onToggle={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.onToggleGroup(groupId, !this.props.expanded[groupId]);
                }}
              />
              {this.props.expanded[groupId]
                && (
                  <div>
                    {
                      group.get('options').map((option, i) => (
                        <EntityListSidebarOption
                          key={i}
                          option={option}
                          groupId={group.get('id')}
                          groupType={group.get('type')}
                          onShowForm={this.props.onShowForm}
                          formOptions={formOptions}
                        />
                      ))
                    }
                  </div>
                )
              }
            </Group>
          )
          : null)}
      </div>
    );
  }
}
EntityListSidebarGroups.propTypes = {
  groups: PropTypes.object,
  expanded: PropTypes.object,
  formOptions: PropTypes.node,
  onShowForm: PropTypes.func.isRequired,
  onToggleGroup: PropTypes.func.isRequired,
};

export default EntityListSidebarGroups;

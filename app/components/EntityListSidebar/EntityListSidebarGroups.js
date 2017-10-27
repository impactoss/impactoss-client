/*
 *
 * EntityListSidebarGroups
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import EntityListSidebarGroupLabel from './EntityListSidebarGroupLabel';
import EntityListSidebarOption from './EntityListSidebarOption';

const Styled = styled.div``;

class EntityListSidebarGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const groups = this.props.groups;
    return (
      <Styled>
        { groups && groups.entrySeq().map(([groupId, group]) =>
          group.get('options') && group.get('options').size > 0
            ? (
              <div key={groupId}>
                <EntityListSidebarGroupLabel
                  label={group.get('label')}
                  icon={group.get('icon') || group.get('id')}
                />
                <div>
                  { group.get('options') &&
                    group.get('options').valueSeq().map((option, i) => (
                      <EntityListSidebarOption
                        key={i}
                        option={option}
                        groupId={group.get('id')}
                        onShowForm={this.props.onShowForm}
                      />
                    ))
                  }
                </div>
              </div>
            )
            : null
        )}
      </Styled>
    );
  }
}
EntityListSidebarGroups.propTypes = {
  groups: PropTypes.object,
  onShowForm: PropTypes.func.isRequired,
};

EntityListSidebarGroups.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSidebarGroups;

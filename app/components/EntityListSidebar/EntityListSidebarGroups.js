/*
 *
 * EntityListSidebarGroups
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import styled from 'styled-components';

import EntityListSidebarGroupLabel from './EntityListSidebarGroupLabel';
import EntityListSidebarOption from './EntityListSidebarOption';

const Styled = styled.div``;

export default class EntityListSidebarGroups extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    groups: PropTypes.object,
    onShowForm: PropTypes.func.isRequired,
    // onHideFilterForm: PropTypes.func.isRequired,
  };

  render() {
    const groups = fromJS(this.props.groups);
    return (
      <Styled>
        { groups &&
          groups.entrySeq().map(([groupId, group]) => (
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
                      onClick={this.props.onShowForm}
                    />
                  ))
                }
              </div>
            </div>
          ))
        }
      </Styled>
    );
  }
}

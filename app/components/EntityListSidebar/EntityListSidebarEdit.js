/*
 *
 * EntityListEdit
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import styled from 'styled-components';

const Component = styled.div``;

export default class EntityListSidebarEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    editGroups: PropTypes.object,
    onShowEditForm: PropTypes.func.isRequired,
    // onHideEditForm: PropTypes.func.isRequired,
  };

  renderEditGroup = (group, groupId) => (
    <div key={groupId}>
      <strong>{group.get('label')}</strong>
      <div>
        { group.get('options') &&
          group.get('options').valueSeq().map((option) => (
            <div key={option.get('id')}>
              <button
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.onShowEditForm({
                    group: group.get('id'),
                    optionId: option.get('id'),
                    path: option.get('path'),
                    key: option.get('key'),
                    ownKey: option.get('ownKey'),
                  });
                }}
              >
                {option.get('label')}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );

  render() {
    // const { onHideEditForm,} = this.props;
    const editGroups = fromJS(this.props.editGroups);

    return (
      <Component>
        { editGroups &&
          editGroups.entrySeq().map(([groupId, group]) => this.renderEditGroup(group, groupId))
        }
      </Component>
    );
  }
}

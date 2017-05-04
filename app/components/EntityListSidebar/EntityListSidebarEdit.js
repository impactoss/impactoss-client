/*
 *
 * EntityListEdit
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import styled from 'styled-components';

import EntityListForm from 'containers/EntityListForm';

const Component = styled.div``;

export default class EntityListSidebarEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    editGroups: PropTypes.object,
    formOptions: PropTypes.object,
    onShowEditForm: PropTypes.func.isRequired,
    onHideEditForm: PropTypes.func.isRequired,
    formModel: PropTypes.string,
    onAssign: PropTypes.func.isRequired,
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
    const { onHideEditForm, formModel, onAssign } = this.props;
    const editGroups = fromJS(this.props.editGroups);
    const formOptions = fromJS(this.props.formOptions);

    return (
      <Component>
        { editGroups &&
          editGroups.entrySeq().map(([groupId, group]) => this.renderEditGroup(group, groupId))
        }
        { formOptions &&
          <EntityListForm
            model={formModel}
            title={formOptions.get('title')}
            options={formOptions.get('options').toList()}
            multiple={formOptions.get('multiple')}
            required={formOptions.get('required')}
            filter={formOptions.get('filter')}
            onSubmit={onAssign}
            onCancel={onHideEditForm}
            buttons={[
              {
                type: 'simple',
                title: 'Cancel',
                onClick: onHideEditForm,
              },
              {
                type: 'primary',
                title: 'Assign',
                submit: true,
                // TODO consider making button inactive when form unchanged
              },
            ]}
          />
        }
      </Component>
    );
  }
}

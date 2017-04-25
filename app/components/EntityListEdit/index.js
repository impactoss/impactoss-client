/*
 *
 * EntityListEdit
 *
 */

import React, { PropTypes } from 'react';
import { Map } from 'immutable';

import EntityListEditForm from 'containers/EntityListEditForm';
// import Option from 'containers/EntityListEditForm/Option';

export default class EntityListEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    editGroups: PropTypes.instanceOf(Map),
    formOptions: PropTypes.object,
    onShowEditForm: PropTypes.func.isRequired,
    onHideEditForm: PropTypes.func.isRequired,
    formModel: PropTypes.string,
    onAssign: PropTypes.func.isRequired,
  };

  // getFormOptions = (formOptions) =>
  //   formOptions.toList().sortBy((option) => option.get('label'));

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
    const { editGroups, formOptions, onHideEditForm, formModel, onAssign } = this.props;
    return (
      <div>
        { editGroups &&
          editGroups.entrySeq().map(([groupId, group]) => this.renderEditGroup(group, groupId))
        }
        { formOptions &&
          <EntityListEditForm
            model={formModel}
            title={formOptions.get('title')}
            options={formOptions.get('options').toList()}
            multiple={formOptions.get('multiple')}
            required={formOptions.get('required')}
            onClose={onHideEditForm}
            onSubmit={onAssign}
          />
        }
      </div>
    );
  }
}

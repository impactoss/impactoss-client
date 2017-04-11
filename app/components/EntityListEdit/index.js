/*
 *
 * EntityListEdit
 *
 */

import React, { PropTypes } from 'react';
import Immutable, { Map } from 'immutable';

import EditForm from 'components/EditForm';
import Option from 'components/EditForm/Option';
import { STATES as CHECKBOX_STATES } from 'components/IndeterminateCheckbox';

export default class EntityListEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    editGroups: PropTypes.instanceOf(Immutable.Map),
    formOptions: PropTypes.object,
    onShowEditForm: PropTypes.func.isRequired,
    onHideEditForm: PropTypes.func.isRequired,
    formModel: PropTypes.string,
    onAssign: PropTypes.func.isRequired,
  };

  getFormOptions = (formOptions) =>
    formOptions.toList().sortBy((option) => option.get('label')).map((option) => Map({
      value: Map({
        checked: this.getCheckState(option),
        value: option.get('value'),
      }),
      label: <Option label={option.get('label')} count={option.get('count')} />,
    }));

  getCheckState = (option) => {
    if (option.get('all')) {
      return CHECKBOX_STATES.checked;
    }
    if (option.get('none')) {
      return CHECKBOX_STATES.unchecked;
    }
    return CHECKBOX_STATES.indeterminate;
  }

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
                  // Here we are recording the path to the "edit options" that we want to display within this.props.editOptions
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
          <EditForm
            model={formModel}
            title={formOptions.get('title')}
            options={this.getFormOptions(formOptions.get('options'))}
            onClose={onHideEditForm}
            onSubmit={onAssign}
          />
        }
      </div>
    );
  }
}

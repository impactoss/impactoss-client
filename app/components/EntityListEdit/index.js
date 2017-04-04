/*
 *
 * EntityListEdit
 *
 */

import React, { PropTypes } from 'react';
import Immutable, { Map } from 'immutable';

// import EditForm from 'components/EditForm';
// import Option from 'components/EditForm/Option';

export default class EntityListEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    editGroups: PropTypes.instanceOf(Immutable.Map),
    // formOptions: PropTypes.object,
    onShowEditForm: PropTypes.func.isRequired,
    // onHideEditForm: PropTypes.func.isRequired,
    // formModel: PropTypes.string,
  };

  // static contextTypes = {
  //   intl: React.PropTypes.object.isRequired,
  // };

  getFormOptions(formOptions) {
    // Display the options
    return formOptions.toList().sortBy((option) => option.get('label')).map((option) => Map({
      value: option,
      label: <div label={option.get('label')} />,
    }));
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
// { formOptions &&
//   <EditForm
//     model={formModel}
//     title={formOptions.get('title')}
//     options={this.getFormOptions(formOptions.get('options'))}
//     onClose={onHideEditForm}
//   />
// }
  render() {
    // const { editGroups, formOptions, onHideEditForm, formModel } = this.props;
    const { editGroups } = this.props;
    return (
      <div>
        { editGroups &&
          editGroups.entrySeq().map(([groupId, group]) => this.renderEditGroup(group, groupId))
        }
      </div>
    );
  }
}

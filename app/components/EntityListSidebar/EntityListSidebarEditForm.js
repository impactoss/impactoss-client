/*
 *
 * EntityListEdit
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';

import EntityListForm from 'containers/EntityListForm';

export default class EntityListSidebarEditForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    formOptions: PropTypes.object,
    onHideEditForm: PropTypes.func.isRequired,
    formModel: PropTypes.string,
    onAssign: PropTypes.func.isRequired,
  };

  render() {
    const { onHideEditForm, formModel, onAssign } = this.props;
    const formOptions = fromJS(this.props.formOptions);

    return (
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
    );
  }
}

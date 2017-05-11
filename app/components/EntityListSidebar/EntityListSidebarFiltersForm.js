/*
 *
 * EntityListFilters
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';

import EntityListForm from 'containers/EntityListForm';

export default class EntityListSidebarFiltersForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    formOptions: PropTypes.object,
    onHideFilterForm: PropTypes.func.isRequired,
    formModel: PropTypes.string,
  };

  render() {
    const { onHideFilterForm, formModel } = this.props;
    const formOptions = fromJS(this.props.formOptions);
    return (
      <EntityListForm
        model={formModel}
        title={formOptions.get('title')}
        options={formOptions.get('options').toList()}
        filter={formOptions.get('filter')}
        onCancel={onHideFilterForm}
        buttons={[
          {
            type: 'simple',
            title: 'Close',
            onClick: onHideFilterForm,
          },
        ]}
      />
    );
  }
}

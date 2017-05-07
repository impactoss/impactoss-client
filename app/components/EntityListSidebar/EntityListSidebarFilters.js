/*
 *
 * EntityListFilters
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';

import EntityListForm from 'containers/EntityListForm';

export default class EntityListSidebarFilters extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    filterGroups: PropTypes.object,
    formOptions: PropTypes.object,
    onShowFilterForm: PropTypes.func.isRequired,
    onHideFilterForm: PropTypes.func.isRequired,
    formModel: PropTypes.string,
  };

  renderFilterGroup = (group, groupId) => (
    <div key={groupId}>
      <strong>{group.get('label')}</strong>
      <div>
        { group.get('options') &&
          group.get('options').valueSeq().map((option) => (
            <div key={option.get('id')}>
              <button
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  // Here we are recording the path to the "filter options" that we want to display within this.props.filterOptions
                  this.props.onShowFilterForm({
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

  render() {
    const { onHideFilterForm, formModel } = this.props;
    const filterGroups = fromJS(this.props.filterGroups);
    const formOptions = fromJS(this.props.formOptions);
    return (
      <div>
        { filterGroups &&
          filterGroups.entrySeq().map(([groupId, group]) => this.renderFilterGroup(group, groupId))
        }
        { formOptions &&
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
        }
      </div>
    );
  }
}

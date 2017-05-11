/*
 *
 * EntityListFilters
 *
 */

import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';

export default class EntityListSidebarFilters extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    filterGroups: PropTypes.object,
    onShowFilterForm: PropTypes.func.isRequired,
    // onHideFilterForm: PropTypes.func.isRequired,
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
    // const { onHideFilterForm } = this.props;
    const filterGroups = fromJS(this.props.filterGroups);
    return (
      <div>
        { filterGroups &&
          filterGroups.entrySeq().map(([groupId, group]) => this.renderFilterGroup(group, groupId))
        }
      </div>
    );
  }
}

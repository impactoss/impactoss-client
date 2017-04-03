/*
 *
 * EntityListFilters
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Immutable, { Map } from 'immutable';

import FilterForm from 'components/FilterForm';
import Option from 'components/FilterForm/Option';

import {
  FORM_MODEL,
} from './constants';

import {
  optionsPathSelector,
  filtersCheckedSelector,
} from './selectors';

import {
  showFilterForm,
  hideFilterForm,
} from './actions';

export class EntityListFilters extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getFormOptions() {
    const { filterOptions, optionsPath } = this.props;
    // Display the options at [`optionsPath`] ( which is set in the onClick of renderFilterGroup )
    if (optionsPath.length > 0 && filterOptions.hasIn(optionsPath)) {
      return filterOptions.getIn(optionsPath).toList().sortBy((option) => option.get('label')).map((option) => Map({
        value: option,
        label: <Option label={option.get('label')} count={option.get('count')} />,
      }));
    }
    return null;
  }

  renderFilterGroup = (group, groupId) => (
    <div key={groupId}>
      <strong>{group.get('label')}</strong>
      <div>
        { group.get('options') &&
          group.get('options').entrySeq().map(([optionId, option]) => (
            <div key={optionId}>
              <button
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  // Here we are recording the path to the "filter options" that we want to display within this.props.filterOptions
                  this.props.onShowFilterForm(group.get('label'), [groupId, 'options', optionId, 'options']);
                }}
              >{option.get('label')}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );

  render() {
    const { filterOptions, onHideFilterForm } = this.props;
    const formOptions = this.getFormOptions();

    return (
      <div>
        { filterOptions &&
          filterOptions.entrySeq().map(([groupId, group]) => this.renderFilterGroup(group, groupId))
        }
        { formOptions &&
          <FilterForm
            model={FORM_MODEL}
            options={formOptions}
            onClose={onHideFilterForm}
          />
        }
      </div>
    );
  }
}

EntityListFilters.propTypes = {
  filterOptions: PropTypes.instanceOf(Immutable.Map),
  onShowFilterForm: PropTypes.func.isRequired,
  onHideFilterForm: PropTypes.func.isRequired,
  optionsPath: PropTypes.array,
};

EntityListFilters.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  optionsPath: optionsPathSelector,
  filtersChecked: filtersCheckedSelector,
});

function mapDispatchToProps(dispatch) {
  return {
    onShowFilterForm: (title, optionsPath) => {
      dispatch(showFilterForm(title, optionsPath));
    },
    onHideFilterForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(hideFilterForm());
    },
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(EntityListFilters);
export default connect(mapStateToProps, mapDispatchToProps)(EntityListFilters);

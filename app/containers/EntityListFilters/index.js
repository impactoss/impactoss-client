/*
 *
 * EntityListFilter
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
// import { browserHistory } from 'react-router';
import { map } from 'lodash/collection';
//
import Immutable, { fromJS } from 'immutable';

import FilterForm from 'components/FilterForm';

// import EntityListFilterForm from 'components/EntityListFilterForm';
import {
  FORM_MODEL,
} from './constants';

import {
  showFilterFormSelector,
  formOptionsSelector,
  filtersCheckedSelector,
} from './selectors';

import {
  showFilterForm,
  hideFilterForm,
} from './actions';

export class EntityListFilters extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // componentWillMount() {
    // if (this.props.filterOptions) {
    //   this.props.populateForm('entityListFilters.form.data', this.getInitialFormData());
    // }
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   // console.log('componentWillReceiveProps', nextProps, this.props)
  //   // repopulate if new data becomes ready
  //   if (nextProps.filterOptions) {
  //     this.props.populateForm('entityListFilters.form.data', this.getInitialFormData(nextProps.filterOptions));
  //   }
  // }

  // getInitialFormData = (nextProps) => {
  //   // console.log('getInitialFormData')
  //   const props = nextProps || this.props;
  //   return map(props.filterOptions, (group) => group.options);
  // }

  // return (
  //   <EntityListFilterForm
  //     model=`entityListFilters.form.filterGroups.${groupId}`
  //   />
  // )
  renderFilterGroup = (group, groupId) => (
    <div key={groupId}>
      <strong>{group.label}</strong>
      <div>
        { group.options &&
          map(group.options, (option, id) => (
            <div key={id}>
              <button
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.onShowFilterForm(option);
                }}
              >{option.label}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );

  render() {
    const { filterOptions, formOptions, onHideFilterForm } = this.props;
    return (
      <div>
        { filterOptions &&
          map(filterOptions, (group, groupId) => this.renderFilterGroup(group, groupId))
        }
        { this.props.showFilterForm &&
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
  filterOptions: PropTypes.object,
  showFilterForm: PropTypes.bool,
  onShowFilterForm: PropTypes.func.isRequired,
  onHideFilterForm: PropTypes.func.isRequired,
  // populateForm: PropTypes.func,
  formOptions: PropTypes.instanceOf(Immutable.List),
  // handleSubmit: PropTypes.func.isRequired,
  // handleCancel: PropTypes.func.isRequired,
  // form: PropTypes.object,
};

EntityListFilters.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  showFilterForm: showFilterFormSelector,
  formOptions: formOptionsSelector,
  filtersChecked: filtersCheckedSelector,
});

function mapDispatchToProps(dispatch) {
  return {
    populateForm: (model, formData) => {
      // console.log('populateForm', formData)
      dispatch(formActions.load(model, fromJS(formData)));
    },
    onShowFilterForm: (option) => {
      dispatch(showFilterForm(option.label, Object.values(option.options)));
    },
    onHideFilterForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(hideFilterForm());
    },
    handleSubmit: () => {

    },
    handleCancel: () => {

    },
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(EntityListFilters);
export default connect(mapStateToProps, mapDispatchToProps)(EntityListFilters);

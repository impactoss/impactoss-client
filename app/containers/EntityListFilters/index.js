/*
 *
 * EntityListFilter
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
// import { browserHistory } from 'react-router';
import { map } from 'lodash/collection';
//
import { fromJS } from 'immutable';

// import EntityListFilterForm from 'components/EntityListFilterForm';

// import { formSelector } from './selectors';

export class EntityListFilters extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    if (this.props.filterOptions) {
      this.props.populateForm('entityListFilters.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props)
    // repopulate if new data becomes ready
    if (nextProps.filterOptions) {
      this.props.populateForm('entityListFilters.form.data', this.getInitialFormData(nextProps.filterOptions));
    }
  }
  getInitialFormData = (nextProps) => {
    // console.log('getInitialFormData')
    const props = nextProps || this.props;
    return map(props.filterOptions, (group) => group.options);
  }
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
          map(group.options, (option, id) => (<div key={id}>{option.label}</div>))
        }
      </div>
    </div>
  );

  render() {
    const { filterOptions } = this.props;
    // console.log(this.props)
    // <EntityListFiltersForm
    //   model="entityListFilters.form.data"
    //   handleSubmit={this.props.handleSubmit}
    // />
    return (
      <div>
        { filterOptions &&
          map(filterOptions, (group, groupId) => this.renderFilterGroup(group, groupId))
        }
      </div>
    );
  }
}

EntityListFilters.propTypes = {
  filterOptions: PropTypes.object,
  populateForm: PropTypes.func,
  // handleSubmit: PropTypes.func.isRequired,
  // handleCancel: PropTypes.func.isRequired,
  // form: PropTypes.object,
};

EntityListFilters.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

// const mapStateToProps = (state, props) => ({
//   // form: formSelector(state),
// })
function mapDispatchToProps(dispatch) {
  return {
    populateForm: (model, formData) => {
      // console.log('populateForm', formData)
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: () => {

    },
    handleCancel: () => {

    },
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(EntityListFilters);
export default connect(null, mapDispatchToProps)(EntityListFilters);

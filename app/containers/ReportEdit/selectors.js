import { createSelector } from 'reselect';

/**
 * Direct selector to the reportEdit state domain
 */
const selectReportEditDomain = (state) => state.get('reportEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectReportEditDomain,
  (substate) => substate.get('page').toJS()
 );
const formSelector = createSelector(
  selectReportEditDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by ReportEdit
 */

const reportEditSelect = createSelector(
  selectReportEditDomain,
  (substate) => substate.toJS()
);

export default reportEditSelect;
export {
  selectReportEditDomain,
  reportEditSelect,
  pageSelector,
  formSelector,
};

import { createSelector } from 'reselect';

/**
 * Direct selector to the reportEdit state domain
 */
const selectReportEditDomain = (state) => state.get('reportEdit');

/**
 * Default selector used by ReportEdit
 */

const viewDomainSelect = createSelector(
  selectReportEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectReportEditDomain,
};

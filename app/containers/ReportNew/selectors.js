import { createSelector } from 'reselect';

/**
 * Direct selector to the reportNew state domain
 */
const selectReportNewDomain = () => (state) => state.get('reportNew');

/**
 * Default selector used by ReportNew
 */

const viewDomainSelect = createSelector(
  selectReportNewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectReportNewDomain,
};

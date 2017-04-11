import { createSelector } from 'reselect';

/**
 * Direct selector to the reportNew state domain
 */
const selectReportNewDomain = () => (state) => state.get('reportNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ReportNew
 */

const reportNewSelector = createSelector(
  selectReportNewDomain(),
  (substate) => substate.toJS()
);

export default reportNewSelector;
export {
  selectReportNewDomain,
};

import { createSelector } from 'reselect';

/**
 * Direct selector to the actionImport state domain
 */
const selectViewDomain = () => (state) => state.get('indicatorImport');

/**
 * Default selector used by IndicatorImport
 */

const viewDomainSelect = createSelector(
  selectViewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectViewDomain,
};

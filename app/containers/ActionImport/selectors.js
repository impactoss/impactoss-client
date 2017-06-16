import { createSelector } from 'reselect';

/**
 * Direct selector to the actionImport state domain
 */
const selectViewDomain = () => (state) => state.get('actionImport');

/**
 * Default selector used by ActionImport
 */

const viewDomainSelect = createSelector(
  selectViewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectViewDomain,
};

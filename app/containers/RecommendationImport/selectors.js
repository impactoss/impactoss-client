import { createSelector } from 'reselect';

/**
 * Direct selector to the recommendationImport state domain
 */
const selectViewDomain = () => (state) => state.get('recommendationImport');

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

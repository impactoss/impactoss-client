import { createSelector } from 'reselect';

/**
 * Direct selector to the actionImport state domain
 */
const selectViewDomain = () => (state) => state.get('sdgtargetImport');

/**
 * Default selector used by SdgTargetImport
 */

const viewDomainSelect = createSelector(
  selectViewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectViewDomain,
};

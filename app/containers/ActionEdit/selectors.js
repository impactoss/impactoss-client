import { createSelector } from 'reselect';

/**
 * Direct selector to the measureEdit state domain
 */
const selectActionEditDomain = (state) => state.get('measureEdit');

/**
 * Default selector used by ActionEdit
 */
const viewDomainSelect = createSelector(
  selectActionEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectActionEditDomain,
};

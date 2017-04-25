import { createSelector } from 'reselect';

/**
 * Direct selector to the userEdit state domain
 */
const selectUserEditDomain = (state) => state.get('userEdit');

/**
 * Default selector used by UserEdit
 */

const viewDomainSelect = createSelector(
  selectUserEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectUserEditDomain,
};

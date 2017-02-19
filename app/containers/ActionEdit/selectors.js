import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectActionEditDomain = () => (state) => state.get('actionEdit');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ActionEdit
 */

const makeSelectActionEdit = () => createSelector(
  selectActionEditDomain(),
  (substate) => substate.toJS()
);

export default makeSelectActionEdit;
export {
  selectActionEditDomain,
};

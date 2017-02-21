import { createSelector } from 'reselect';

/**
 * Direct selector to the actionView state domain
 */
const selectActionViewDomain = () => (state) => state.get('actionView');

/**
 * Other specific selectors
 */
const idSelector = createSelector(
  selectActionViewDomain(),
  (substate) => substate.get('id')
);

const actionSelector = createSelector(
  selectActionViewDomain,
  (substate) => substate.get('action')
);

/**
 * Default selector used by ActionView
 */

const makeSelectActionView = () => createSelector(
  selectActionViewDomain(),
  (substate) => substate.toJS()
);

export default makeSelectActionView;
export {
  selectActionViewDomain,
  idSelector,
  makeSelectActionView,
  actionSelector,
};

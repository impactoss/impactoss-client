import { createSelector } from 'reselect';

/**
 * Direct selector to the pageEdit state domain
 */
const selectPageEditDomain = (state) => state.get('pageEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectPageEditDomain,
  (substate) => substate.get('page').toJS()
 );
const formSelector = createSelector(
  selectPageEditDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by PageEdit
 */

const pageEditSelect = createSelector(
  selectPageEditDomain,
  (substate) => substate.toJS()
);

export default pageEditSelect;
export {
  selectPageEditDomain,
  pageEditSelect,
  pageSelector,
  formSelector,
};

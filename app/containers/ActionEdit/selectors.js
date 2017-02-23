import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectActionEditDomain = () => (state) => state.get('actionEdit');

/**
 * Other specific selectors
 */

const idSelector = createSelector(
   selectActionEditDomain(),
  (substate) => substate.getIn(['page', 'id'])
 );

const pageSelector = createSelector(
  selectActionEditDomain(),
  (substate) => substate.get('page').toJS()
 );

const actionSelector = createSelector(
 selectActionEditDomain(),
  (substate) => substate.getIn(['form']).action.toJS()
);

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
  idSelector,
  makeSelectActionEdit,
  actionSelector,
  pageSelector,
};

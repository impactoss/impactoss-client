import { createSelector } from 'reselect';
import { actionsSelector } from 'containers/App/selectors';

/**
 * Direct selector to the actionEdit state domain
 */
const selectActionEditDomain = (state) => state.get('actionEdit');

/**
 * Other specific selectors
 */

const idSelector = createSelector(
   selectActionEditDomain,
  (substate) => substate.getIn(['page', 'id'])
 );

const pageSelector = createSelector(
  selectActionEditDomain,
  (substate) => substate.get('page').toJS()
 );

const formDataSelector = createSelector(
 selectActionEditDomain,
  (substate) => substate.get('form').action.toJS()
);

const notFoundSelector = createSelector(
  selectActionEditDomain,
  (substate) => substate.getIn(['page', 'actionNotFound'])
);

const actionSelector = createSelector(
  actionsSelector,
  idSelector,
  (actions, id) => id ? actions.get(id) : null
);

const actionJSSelector = createSelector(
  actionSelector,
  (actions) => actions ? actions.toJS() : null
);

/**
 * Default selector used by ActionEdit
 */

const actionEditSelect = createSelector(
  selectActionEditDomain,
  (substate) => substate.toJS()
);

export default actionEditSelect;
export {
  selectActionEditDomain,
  idSelector,
  actionEditSelect,
  actionSelector,
  actionJSSelector,
  pageSelector,
  notFoundSelector,
  formDataSelector,
};

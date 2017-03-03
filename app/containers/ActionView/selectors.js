import { createSelector } from 'reselect';
import { actionsSelector } from 'containers/App/selectors';

/**
 * Direct selector to the actionView state domain
 */
const actionViewSelector = (state) => state.get('actionView');

/**
 * Other specific selectors
 */
const idSelector = createSelector(
  actionViewSelector,
  (substate) => substate.get('id')
);

const notFoundSelector = createSelector(
  actionViewSelector,
  (substate) => substate.get('actionNotFound')
);

const actionSelector = createSelector(
  actionsSelector,
  idSelector,
  (actions, id) => id && actions.has(id) ? actions.get(id).toJS() : null
);

/**
 * Default selector used by ActionView
 */

const actionViewPageSelector = createSelector(
  actionViewSelector,
  (substate) => substate.toJS()
);

export default actionViewPageSelector;
export {
  idSelector,
  actionViewPageSelector,
  actionSelector,
  notFoundSelector,
};

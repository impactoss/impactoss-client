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

const actionFoundSelector = createSelector(
  actionsSelector,
  idSelector,
  (actions, id) => id && actions.has(id)
);

const actionSelector = (state, props) =>
  state.getIn(['global', 'entities', 'actions']).get(props.params.id);

const makeActionSelector = () => createSelector(
    actionSelector,
    (action) => action ? action.toJS() : null
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
  actionFoundSelector,
  makeActionSelector,
};

import { createSelector } from 'reselect';
// import { actionsSelector } from 'containers/App/selectors';

/**
 * Direct selector to the actionView state domain
 */
const actionViewSelector = (state) => state.get('actionView');

/**
 * Other specific selectors
 */


const actionSelector = (state, props) =>
  state.getIn(['global', 'entities', 'actions']).get(props.params.id);

const makeActionSelector = () => createSelector(
  actionSelector,
  (action) => action ? action.toJS() : null
);

const actionsReadySelector = (state) =>
  !!state.getIn(['global', 'entities', 'actions']).size && !!state.getIn(['global', 'requested', 'actions']);

const makeActionsReadySelector = () => createSelector(
  actionsReadySelector,
  (ready) => ready
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
  actionViewPageSelector,
  makeActionsReadySelector,
  makeActionSelector,
};

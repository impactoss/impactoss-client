import { createSelector } from 'reselect';
// import { actionsSelector } from 'containers/App/selectors';

/**
 * Direct selector to the actionView state domain
 */
const actionViewSelector = (state) => state.get('actionView');

/**
 * Other specific selectors
 */
const actionsReadySelector = createSelector(
  actionViewSelector,
  (substate) => substate.get('actionsReady'),
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
  actionViewPageSelector,
  actionsReadySelector,
  makeActionSelector,
};

import { createSelector } from 'reselect';
import { orderBy } from 'lodash/collection';
import { actionsSelector } from '../App/selectors';

/**
* TODO implement filtering selectors, see actionsSortedSelector as a reference
*/

/**
* Used by lodash's orderBy function
* https://lodash.com/docs/4.17.4#orderBy
* returns an iteratee applicable to the field, defaults to field name ( which will alpha sort that field )
*
* TODO next steps handle date sort etc
*/
const getSortIteratee = (field) => {
  switch (field) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return (action) => parseInt(action.id, 10);
    default:
      return field;
  }
};

const actionListSelector = (state) => state.get('actionList');

const sortBySelector = createSelector(
  actionListSelector, // Note this imported from App/selectors
  (substate) => [substate.get('sort'), substate.get('order')]
);

/**
* Convert entity Map to a List
*/
const actionsListSelector = createSelector(
  actionsSelector,
  (actions) => actions.toList()
);

/**
* Convert List to a JS array
*/
const actionsListJSSelector = createSelector(
  actionsListSelector,
  (list) => list.toJS()
);

/**
* Order JS list of actions based on sort state
*/
const actionsSortedSelector = createSelector(
  actionsListJSSelector,
  sortBySelector,
  (actions, [sort, order]) => orderBy(actions, getSortIteratee(sort), order)
);

/**
* Convert container state to JS  ( maybe not needed )
*/
const actionViewJSSelector = createSelector(
  actionListSelector,
  (substate) => substate.toJS()
);

export default actionViewJSSelector;

export {
  actionsSortedSelector,
  actionsListSelector,
  actionsListJSSelector,
  sortBySelector,
};

import { createSelector } from 'reselect';

/**
 * Direct selector to the recommendationEdit state domain
 */
const selectRecommendationEditDomain = (state) => state.get('recommendationEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectRecommendationEditDomain,
  (substate) => substate.get('page').toJS()
 );
const formSelector = createSelector(
  selectRecommendationEditDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by RecommendationEdit
 */

const recommendationEditSelect = createSelector(
  selectRecommendationEditDomain,
  (substate) => substate.toJS()
);

export default recommendationEditSelect;
export {
  selectRecommendationEditDomain,
  recommendationEditSelect,
  pageSelector,
  formSelector,
};

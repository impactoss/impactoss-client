import { createSelector } from 'reselect';

/**
 * Direct selector to the recommendationNew state domain
 */
const selectRecommendationNewDomain = () => (state) => state.get('recommendationNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by RecommendationNew
 */

const makeSelectRecommendationNew = () => createSelector(
  selectRecommendationNewDomain(),
  (substate) => substate.toJS()
);

export default makeSelectRecommendationNew;
export {
  selectRecommendationNewDomain,
};

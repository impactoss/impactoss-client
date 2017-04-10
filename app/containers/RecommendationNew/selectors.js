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

const recommendationNewSelector = createSelector(
  selectRecommendationNewDomain(),
  (substate) => substate.toJS()
);

export default recommendationNewSelector;
export {
  selectRecommendationNewDomain,
};

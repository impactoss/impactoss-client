/*
 * RecommendationView Messages
 *
 * This contains all the text for the RecommendationView component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.RecommendationView.header',
    defaultMessage: 'Recommendation',
  },
  notFound: {
    id: 'app.containers.RecommendationView.notFound',
    defaultMessage: 'Sorry no recommendation found',
  },
  loading: {
    id: 'app.containers.RecommendationView.loading',
    defaultMessage: 'Loading recommendation...',
  },
});

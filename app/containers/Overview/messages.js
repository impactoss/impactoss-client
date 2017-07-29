/*
 * Overview Messages
 *
 * This contains all the text for the Taxonomies component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  supTitle: {
    id: 'app.containers.Overview.supTitle',
    defaultMessage: 'Explore',
  },
  title: {
    id: 'app.containers.Overview.title',
    defaultMessage: 'Implementation plan of actions in context',
  },
  description: {
    id: 'app.containers.Overview.description',
    defaultMessage: 'Start exploring by selecting a category group from the sidebar or one of the areas from the diagram below.',
  },
  buttons: {
    recommendations: {
      id: 'app.containers.Overview.buttons.recommendations',
      defaultMessage: 'Recommendations',
    },
    sdgtargets: {
      id: 'app.containers.Overview.buttons.sdgtargets',
      defaultMessage: 'SDG targets',
    },
    measures: {
      id: 'app.containers.Overview.buttons.measures',
      defaultMessage: 'Implementation plan',
    },
    measuresAdditional: {
      id: 'app.containers.Overview.buttons.measures',
      defaultMessage: 'Government actions',
    },
    indicators: {
      id: 'app.containers.Overview.buttons.indicators',
      defaultMessage: 'Indicators',
    },
  },
  diagram: {
    categorised: {
      id: 'app.containers.Overview.diagram.categorised',
      defaultMessage: 'categorised by',
    },
    addressed: {
      id: 'app.containers.Overview.diagram.addressed',
      defaultMessage: 'addressed by',
    },
    measured: {
      id: 'app.containers.Overview.diagram.measured',
      defaultMessage: 'measured by',
    },
  },
  metaDescription: {
    id: 'app.containers.Overview.metaDescription',
    defaultMessage: 'Overview',
  },
});

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
    defaultMessage: 'The implementation plan and related subjects',
  },
  description: {
    id: 'app.containers.Overview.description',
    defaultMessage: 'Start exploring by selecting a category group from the sidebar or one of the subjects from the diagram below.',
  },
  buttons: {
    draft: {
      id: 'app.containers.Overview.buttons.draft',
      defaultMessage: '({count} draft)',
    },
    recommendations: {
      id: 'app.containers.Overview.buttons.recommendations',
      defaultMessage: '{count} Recommendations',
    },
    sdgtargets: {
      id: 'app.containers.Overview.buttons.sdgtargets',
      defaultMessage: '{count} SDG targets',
    },
    measures: {
      id: 'app.containers.Overview.buttons.measures',
      defaultMessage: 'Implementation plan',
    },
    measuresAdditional: {
      id: 'app.containers.Overview.buttons.measuresAdditional',
      defaultMessage: '{count} Government actions',
    },
    indicators: {
      id: 'app.containers.Overview.buttons.indicators',
      defaultMessage: '{count} Indicators',
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

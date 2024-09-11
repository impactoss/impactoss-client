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
  moreLink: {
    id: 'app.containers.Overview.moreLink',
    defaultMessage: 'See About page.',
  },
  buttons: {
    draft: {
      id: 'app.containers.Overview.buttons.draft',
      defaultMessage: '({count} draft)',
    },
    title: {
      id: 'app.containers.Overview.buttons.title',
      defaultMessage: '{label} in database. Select to navigate to list view',
    },
    titleCategoryIcon: {
      id: 'app.containers.Overview.buttons.titleCategoryIcon',
      defaultMessage: '{label}. Select to navigate to category group view',
    },
    measures: {
      id: 'app.containers.Overview.buttons.measures',
      defaultMessage: '{count} Government actions',
    },
    measuresTitle: {
      id: 'app.containers.Overview.buttons.measuresTitle',
      defaultMessage: 'Implementation plan',
    },
    measuresAdditional: {
      id: 'app.containers.Overview.buttons.measuresAdditional',
      defaultMessage: '{count} Government actions',
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

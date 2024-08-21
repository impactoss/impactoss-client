/*
 * Global Settings Messages
 *
 * This contains all the text for the global settings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  subHeading: {
    id: 'app.containers.GlobalSettings.subHeading',
    defaultMessage: 'Configure content',
  },
  subHeadingText: {
    id: 'app.containers.GlobalSettings.subHeadingText',
    defaultMessage: 'Optionally include content from past reporting cycles and/or archived content',
  },
  title: {
    loadNonCurrent: {
      id: 'app.containers.GlobalSettings.title.loadNonCurrent',
      defaultMessage: 'Content by reporting cycle',
    },
    loadArchived: {
      id: 'app.containers.GlobalSettings.title.loadArchived',
      defaultMessage: 'Archived content',
    },
  },
  label: {
    loadNonCurrent: {
      id: 'app.containers.GlobalSettings.label.loadNonCurrent',
      defaultMessage: 'Include content from past reporting cycles',
    },
    loadArchived: {
      id: 'app.containers.GlobalSettings.label.loadArchived',
      defaultMessage: 'Include archived content',
    },
  },
  description: {
    loadNonCurrent: {
      id: 'app.containers.GlobalSettings.description.loadNonCurrent',
      defaultMessage: 'By default only current recommendations are loaded, ie those that belong to the most recent reporting cycle of each human rights body. Likewise only those actions and indicators are loaded that are related to a current recommendation',
    },
    loadArchived: {
      id: 'app.containers.GlobalSettings.description.loadArchived',
      defaultMessage: 'By default archived content is not loaded',
    },
  },
});

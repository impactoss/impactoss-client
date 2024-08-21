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
    includePast: {
      id: 'app.containers.GlobalSettings.title.includePast',
      defaultMessage: 'Content by reporting cycle',
    },
    includeArchive: {
      id: 'app.containers.GlobalSettings.title.includeArchive',
      defaultMessage: 'Archived content',
    },
  },
  label: {
    includePast: {
      id: 'app.containers.GlobalSettings.label.includePast',
      defaultMessage: 'Include content from past reporting cycles',
    },
    includeArchive: {
      id: 'app.containers.GlobalSettings.label.includeArchive',
      defaultMessage: 'Include archived content',
    },
  },
  description: {
    includePast: {
      id: 'app.containers.GlobalSettings.description.includePast',
      defaultMessage: 'By default only current recommendations are loaded, ie those that belong to the most recent reporting cycle of each human rights body. Likewise only those actions and indicators are loaded that are related to a current recommendation',
    },
    includeArchive: {
      id: 'app.containers.GlobalSettings.description.includeArchive',
      defaultMessage: 'By default archived content is not loaded',
    },
  },
});

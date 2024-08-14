/*
 * Global Settings Messages
 *
 * This contains all the text for the global settings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.containers.GlobalSettings.title',
    defaultMessage: 'Settings',
  },
  subHeading: {
    id: 'app.containers.GlobalSettings.subHeading',
    defaultMessage: 'Configure content',
  },
  subHeadingText: {
    id: 'app.containers.GlobalSettings.subHeadingText',
    defaultMessage: 'Optionally include content from past reporting cycles and/or archived content',
  },

  isCurrentTitle: {
    id: 'app.containers.GlobalSettings.isCurrentTitle',
    defaultMessage: 'Content by reporting cycle',
  },
  isCurrentHint: {
    id: 'app.containers.GlobalSettings.isCurrentHint',
    defaultMessage: 'Include content from past reporting cycles',
  },
  isCurrentDescription: {
    id: 'app.containers.GlobalSettings.isCurrentDescription',
    defaultMessage: 'By default only current recommendations are loaded, ie those that belong to the most recent reporting cycle of each human rights body. Likewise only those actions and indicators are loaded that are related to a current recommendation',
  },

  isArchivedTitle: {
    id: 'app.containers.GlobalSettings.isArchivedTitle',
    defaultMessage: 'Archived content',
  },
  isArchivedHint: {
    id: 'app.containers.GlobalSettings.isArchivedHint',
    defaultMessage: 'Include archived content',
  },
  isArchivedDescription: {
    id: 'app.containers.GlobalSettings.isArchivedDescription',
    defaultMessage: 'By default only archived is not loaded',
  },

});

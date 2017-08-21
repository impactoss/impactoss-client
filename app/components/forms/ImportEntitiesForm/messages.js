/*
 * Form Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'app.components.ImportEntitiesForm.title',
    defaultMessage: 'Batch import',
  },
  templateHint: {
    id: 'app.components.ImportEntitiesForm.templateHint',
    defaultMessage: 'Import multiple items from a CSV file. For the available fields and field types please ',
  },
  formatHint: {
    id: 'app.components.ImportEntitiesForm.formatHint',
    defaultMessage: 'Please note: when saving from Excel, chose file type "CSV UTF-8 (Comma delimited)".',
  },
  downloadTemplate: {
    id: 'app.components.ImportEntitiesForm.downloadTemplate',
    defaultMessage: 'download the CSV template',
  },
  hasErrors: {
    id: 'app.components.ImportEntitiesForm.hasErrors',
    defaultMessage: 'We are sorry, some of your rows could not be imported.',
  },
  success: {
    id: 'app.components.ImportEntitiesForm.success',
    defaultMessage: 'All rows successfully imported.',
  },
  importAgain: {
    id: 'app.components.ImportEntitiesForm.importAgain',
    defaultMessage: 'Import another file',
  },
  done: {
    id: 'app.components.ImportEntitiesForm.done',
    defaultMessage: 'Back to list',
  },
});

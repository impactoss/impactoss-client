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
  introduction: {
    id: 'app.components.ImportEntitiesForm.introduction',
    defaultMessage: 'Import multiple items from a CSV file.',
  },
  hintTitle: {
    id: 'app.components.ImportEntitiesForm.hintLabel',
    defaultMessage: 'Please note:',
  },
  templateHint: {
    id: 'app.components.ImportEntitiesForm.templateHint',
    defaultMessage: 'For the available fields and field types please ',
  },
  templateHintDownloadLink: {
    id: 'app.components.ImportEntitiesForm.templateHintDownloadLink',
    defaultMessage: 'download the CSV template',
  },
  formatHint: {
    id: 'app.components.ImportEntitiesForm.formatHint',
    defaultMessage: 'When saving from Excel (Office 2016 or later), chose file type "CSV UTF-8 (Comma delimited)". For instructions for previous versions of Excel (Office 2013 and earlier) please refer to the ',
  },
  formatHintLink: {
    id: 'app.components.ImportEntitiesForm.formatHintLink',
    defaultMessage: 'user-manual.impactoss.org/managers/import.html',
  },
  formatHintLinkAnchor: {
    id: 'app.components.ImportEntitiesForm.formatHintLinkAnchor',
    defaultMessage: 'user manual',
  },
  someErrors: {
    id: 'app.components.ImportEntitiesForm.someErrors',
    defaultMessage: 'We are sorry, only {successNo} of {rowNo} row(s) could be imported.',
  },
  allErrors: {
    id: 'app.components.ImportEntitiesForm.allErrors',
    defaultMessage: 'We are sorry, none of the rows could be imported.',
  },
  success: {
    id: 'app.components.ImportEntitiesForm.success',
    defaultMessage: 'All {rowNo} row(s) successfully imported.',
  },
  importAgain: {
    id: 'app.components.ImportEntitiesForm.importAgain',
    defaultMessage: 'Import another file',
  },
  done: {
    id: 'app.components.ImportEntitiesForm.done',
    defaultMessage: 'Back to list',
  },
  importing: {
    id: 'app.components.ImportEntitiesForm.importing',
    defaultMessage: 'Importing: ',
  },
  rowErrorHint: {
    id: 'app.components.ImportEntitiesForm.rowErrorHint',
    defaultMessage: 'Import of the following rows failed:',
  },
  errorHintTitle: {
    id: 'app.components.ImportEntitiesForm.errorHintTitle',
    defaultMessage: 'Important',
  },
  errorHintText: {
    id: 'app.components.ImportEntitiesForm.errorHintText',
    defaultMessage: 'When using the import feature to add the failed rows, please make sure to first remove the successful rows from your csv file - failure to do so will lead to duplicate entries. Alternatively you can add each failed row individually by manually entering each entry.',
  },
});

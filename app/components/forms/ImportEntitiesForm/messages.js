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
  rowResultsHint: {
    id: 'app.components.ImportEntitiesForm.rowResultsHint',
    defaultMessage: 'Please review the results, specifically any errors',
  },
  resultRowNo: {
    id: 'app.components.ImportEntitiesForm.resultRowNo',
    defaultMessage: 'Row {rowNo}',
  },
  resultError: {
    id: 'app.components.ImportEntitiesForm.resultError',
    defaultMessage: 'ERROR creating {isMainItem, select, true {entity} other {relationship(s)}}',
  },
  resultSuccess: {
    id: 'app.components.ImportEntitiesForm.resultSuccess',
    defaultMessage: 'SUCCESS creating {isMainItem, select, true {entity} other {relationship(s)}}',
  },
  errorHintTitle: {
    id: 'app.components.ImportEntitiesForm.errorHintTitle',
    defaultMessage: 'Important',
  },
  errorHintText: {
    id: 'app.components.ImportEntitiesForm.errorHintText',
    defaultMessage: 'When using the import feature to add the failed rows, please make sure to first remove the successful rows from your csv file - failure to do so will lead to duplicate entries. Alternatively you can add each failed row individually by manually entering each entry.',
  },
  hideFieldOverview: {
    id: 'app.components.ImportEntitiesForm.hideFieldOverview',
    defaultMessage: 'Hide field/column overview',
  },
  showFieldOverview: {
    id: 'app.components.ImportEntitiesForm.showFieldOverview',
    defaultMessage: 'Show field/column overview',
  },
  fieldOverviewColumn: {
    id: 'app.components.ImportEntitiesForm.fieldOverviewColumn',
    defaultMessage: 'Field (column name)',
  },
  fieldOverviewInfo: {
    id: 'app.components.ImportEntitiesForm.fieldOverviewInfo',
    defaultMessage: 'Information (column description)',
  },
});

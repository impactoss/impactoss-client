/*
 * FileSelectControl Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  import: {
    single: {
      id: 'app.containers.FileSelectControl.import.single',
      defaultMessage: 'Import {total} row',
    },
    plural: {
      id: 'app.containers.FileSelectControl.import.plural',
      defaultMessage: 'Import {total} rows',
    },
  },
  selectFile: {
    id: 'app.containers.FileSelectControl.selectFile',
    defaultMessage: 'Select File',
  },
});

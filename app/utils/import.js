import { filter, reduce } from 'lodash/collection';
import appMessages from 'containers/App/messages';
import { DB_DATE_FORMAT } from 'themes/config';

export const getImportFields = (shape, formatMessage) => {
  const fields = filter(shape.fields, (field) => field.import === true && !field.disabled);
  const values = reduce(fields, (memo, field) => {
    const value = `${field.required
      ? formatMessage(appMessages.import.required)
      : ''}${formatMessage(appMessages.importFields[field.label || field.attribute])} | ${formatMessage(appMessages.import[field.type], { format: DB_DATE_FORMAT })}`;
    return Object.assign(memo, { [field.attribute]: value });
  }, {});
  return Object.assign(values, { '': formatMessage(appMessages.import.hint) });
};

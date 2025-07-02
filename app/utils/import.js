import { filter, reduce } from 'lodash/collection';
import appMessages from 'containers/App/messages';
import { DATE_FORMAT } from 'themes/config';

const getColumnTitle = (field, formatMessage) => {
  const msg = (appMessages.importFields[field.label] || appMessages.importFields[field.attribute])
    ? formatMessage(appMessages.importFields[field.label || field.attribute])
    : formatMessage(appMessages.attributes[field.label || field.attribute]);
  return `${msg} [database:${field.attribute}]`;
};
const getRelationshipColumnTitle = (field) => {
  let msg = field.attribute;
  msg = `${msg} [rel:${field.attribute}`; // open bracket
  if (field.relationshipValue && field.relationshipValue.code) {
    msg = `${msg}${field.separator || '|'}${field.relationshipValue.code}`;
  }
  return `${msg}]`; // close bracket
};

export const getImportFields = (shape, formatMessage) => {
  let values = {};
  if (shape.fields) {
    const fields = filter(
      shape.fields,
      (field) => field.import === true && !field.disabled
    );
    values = reduce(
      fields,
      (memo, field) => {
        const pre = field.required
          ? formatMessage(appMessages.import.required)
          : formatMessage(appMessages.import.optional);
        const value = `${pre}: ${field.hint || formatMessage(appMessages.import[field.type], { format: DATE_FORMAT })}`;
        return Object.assign(memo, { [getColumnTitle(field, formatMessage)]: value });
      },
      values,
    );
  }
  if (shape.relationshipFields) {
    values = reduce(
      shape.relationshipFields,
      (memo, field) => {
        const pre = field.required
          ? formatMessage(appMessages.import.required)
          : formatMessage(appMessages.import.optional);
        const value = `${pre}: ${field.hint || formatMessage(appMessages.import[field.type])}`;
        return Object.assign(
          memo,
          {
            [getRelationshipColumnTitle(field)]: value,
          },
        );
      },
      values,
    );
  }
  return Object.assign(values, { '': formatMessage(appMessages.import.hint) });
};

export const getColumnAttribute = (columnTitle) => {
  const split = columnTitle.split('[database:');
  return split.length > 1
    ? split[1].replace(']', '')
    : columnTitle;
};

export const countRelationshipsFromRows = (rows) => rows.reduce(
  (counter, row) => {
    const relKeys = Object.keys(row).filter((key) => key.indexOf('[rel:') > -1);
    return relKeys.reduce(
      (counter2, key) => {
        if (row[key] && row[key].trim() !== '') {
          const inc = row[key].split(',').length;
          return counter2 + inc;
        }
        return counter2;
      },
      counter,
    );
  },
  0,
);

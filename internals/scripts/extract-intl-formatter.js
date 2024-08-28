
const pastTranslations = require('../../app/translations/en-NZ.json');
exports.format = function flattenMessages(messages, prefix = '') {
  return Object.entries(messages).reduce(
    (accumulator, [key, value]) => {
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        return {
          ...accumulator,
          [prefixedKey]: value.defaultMessage,
        };
      } else {
        //nested messages
        return {
          ...accumulator,
          ...flattenMessages(value, prefixedKey),
        };
      }
    },
    { ...pastTranslations },
  );
};
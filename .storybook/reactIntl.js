const locales = ['en-NZ'];

const messages = locales.reduce((acc, lang) => ({
  ...acc,
  [lang]: require(`../app/translations/${lang}.json`), // whatever the relative path to your messages json is
}), {});

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'en-NZ',
  locales,
  messages,
  formats,
};
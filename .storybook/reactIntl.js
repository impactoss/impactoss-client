import React from 'react';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LOCALE } from '../app/themes/config';

const locales = ['en-NZ'];

const messages = locales.reduce((acc, lang) => ({
  ...acc,
  [lang]: require(`../app/translations/${lang}.json`),
}), {});

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: DEFAULT_LOCALE,
  locales,
  messages,
  formats,
};

export const withReactIntl = (Story) => (
  <IntlProvider defaultLocale={DEFAULT_LOCALE} locale={DEFAULT_LOCALE} key={DEFAULT_LOCALE} messages={messages[DEFAULT_LOCALE]}>
    <Story />
  </IntlProvider>
);
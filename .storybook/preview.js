
import React from 'react';
import { ThemeProvider } from 'styled-components';
// eslint-disable-next-line  import/no-unresolved
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import nzTheme from '../app/themes/theme-nz';
import samoaTheme from '../app/themes/theme-samoa';
import GlobalStyles from '../app/global-styles';

import { reactIntl } from './reactIntl';
import { IntlProvider } from 'react-intl';


export const decorators = [
  (Story) => (
    <IntlProvider locale="en-NZ" messages={reactIntl.messages}>
      <Story />
    </IntlProvider>
  ),
  withThemeFromJSXProvider({
    themes: {
      nz: nzTheme,
      samoa: samoaTheme,
    },
    defaultTheme: 'nz',
    Provider: ThemeProvider,
    GlobalStyles,
  })];

const preview = {
  initialGlobals: {
    locale: reactIntl.defaultLocale,
    locales: {
      'en-NZ': { title: 'English NZ' },
    },
  },
  parameters: {
    reactIntl,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

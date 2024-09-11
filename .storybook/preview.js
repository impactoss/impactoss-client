
import { withThemeProvider } from './themeProvider';
import { withReactIntl, reactIntl } from './reactIntl';

export const decorators = [withReactIntl, withThemeProvider];

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

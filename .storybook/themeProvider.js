import React from 'react';
// eslint-disable-next-line  import/no-unresolved
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import nzTheme from '../app/themes/theme-nz';
import samoaTheme from '../app/themes/theme-samoa';
import GlobalStyles from '../app/global-styles';

import { Grommet } from 'grommet';

const providerFn = ({ theme, children }) => 
  <StyleSheetManager
    enableVendorPrefixes
    shouldForwardProp={(propName, target) => {
      if (typeof target === "string") {
        // For HTML elements, forward the prop if it is a valid HTML attribute
        return isPropValid(propName);
      }
      // For other elements, forward all props
      return true;
    }}
  >
    <Grommet theme={theme}>
      {children}
    </Grommet>
  </StyleSheetManager>

export const withThemeProvider = withThemeFromJSXProvider({
  themes: {
    nz: nzTheme,
    samoa: samoaTheme,
  },
  defaultTheme: 'nz',
  Provider: providerFn,
  GlobalStyles,
});
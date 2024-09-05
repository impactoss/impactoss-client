import React from 'react';
import { fn } from '@storybook/test';

import Header from '../app/components/ContentHeader';
import { CONTENT_SINGLE } from '../app/containers/App/constants';

export default {
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  //args: {
  // onLogin: fn(),
  //  onLogout: fn(),
  // onCreateAccount: fn(),
  //},
};

export const ContentHeader = (args) =>
  <Header
    {...args}
    title={'Edit Action'}
    type={CONTENT_SINGLE}
    icon="measures"
    buttons={
      [{
        type: 'cancel',
        onClick: fn(),
      },
      {
        type: 'save',
        disabled: false,
        onClick: fn(),
      }]
    }
  />;

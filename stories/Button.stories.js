import React from 'react';
import { fn } from '@storybook/test';
import ButtonFactory from '../app/components/buttons/ButtonFactory';
import ButtonSubmit from '../app/components/buttons/ButtonSubmit';
import appMessages from '../app/containers/App/messages';

import { useIntl } from 'react-intl';

export default {
  title: 'Example/Button',
  component: ButtonFactory,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  //argTypes: {
  //button: { title: 'color' },
  //},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    button: {
      type: 'primary',
      title: 'default',
    },
  },
  globals: { theme: 'nz' },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    button: {
      primary: true,
      title: 'Submit',
    },
  },
};

export const Disabled = {
  args: {
    button: {
      title: 'Button',
      disabled: true,
    },
  },
};

export const FlatPrimary = {
  args: {
    button: {
      type: 'textPrimary',
      title: 'flat button',
    },
  },
};


export const Print = (args) => {
  const intl = useIntl();

  return (
    <ButtonFactory
      {...args}
      button={{
        type: "icon",
        onClick: () => window.print(),
        title: intl.formatMessage(appMessages.buttons.printTitle),
        icon: "print",
      }}
    />
  );
};

export const Add = (args) => {
  const intl = useIntl();

  return (
    <ButtonFactory
      {...args}
      button={{
        type: 'add',
        title: [
          intl.formatMessage(appMessages.buttons.add),
          {
            title: intl.formatMessage(appMessages.entities.measures.single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      }}
    />
  );
};

export const Submit = () => (
  <ButtonSubmit type="submit" disabled={false}>
    Submit
  </ButtonSubmit>
);

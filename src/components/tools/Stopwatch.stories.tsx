import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Stopwatch from './Stopwatch';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

const meta: Meta<typeof Stopwatch> = {
  title: 'Tools/Stopwatch',
  component: Stopwatch,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Stopwatch>;

export const Default: Story = {
  args: {
    // @ts-ignore
    isRunning: false,
  },
};

export const Running: Story = {
  args: {
    // @ts-ignore
    isRunning: true,
  },
};

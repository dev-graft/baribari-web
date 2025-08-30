import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithActiveHome: Story = {
  args: {},
  parameters: {
    reactRouter: {
      routePath: '/',
    },
  },
};

export const WithActiveTools: Story = {
  args: {},
  parameters: {
    reactRouter: {
      routePath: '/tools',
    },
  },
};

export const WithActiveDashboard: Story = {
  args: {},
  parameters: {
    reactRouter: {
      routePath: '/dashboard',
    },
  },
};

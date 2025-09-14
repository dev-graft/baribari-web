import type { Meta, StoryObj } from '@storybook/react';
import QRCodeGenerator from './QRCodeGenerator';

const meta: Meta<typeof QRCodeGenerator> = {
  title: 'Tools/QRCodeGenerator',
  component: QRCodeGenerator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive QR code generator tool that supports various types of content including text, URLs, email, phone, SMS, and WiFi credentials.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default QR code generator with text input mode selected.',
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    className: 'max-w-4xl mx-auto',
  },
  parameters: {
    docs: {
      description: {
        story: 'QR code generator with custom styling applied.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    className: 'max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version of the QR code generator.',
      },
    },
  },
};
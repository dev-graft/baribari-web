import type { Meta, StoryObj } from '@storybook/react';
import UrlEncoder from './UrlEncoder';

const meta: Meta<typeof UrlEncoder> = {
  title: 'Tools/UrlEncoder',
  component: UrlEncoder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'URL 인코딩/디코딩 도구입니다. 텍스트를 URL-safe 형태로 인코딩하거나 인코딩된 URL을 원본 텍스트로 디코딩할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '추가 CSS 클래스명',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: 'max-w-4xl mx-auto',
  },
};

export const EncodeMode: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'URL 인코딩 모드입니다. 텍스트를 URL-safe 형태로 변환합니다.',
      },
    },
  },
};

export const DecodeMode: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'URL 디코딩 모드입니다. 인코딩된 URL을 원본 텍스트로 변환합니다.',
      },
    },
  },
};

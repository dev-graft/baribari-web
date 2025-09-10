import type { Meta, StoryObj } from '@storybook/react';
import StringDiff from './StringDiff';

const meta: Meta<typeof StringDiff> = {
  title: 'Tools/StringDiff',
  component: StringDiff,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '두 텍스트 간의 차이점을 시각적으로 비교하고 하이라이트하는 도구입니다. 문자, 단어, 줄 단위로 비교할 수 있고, 대소문자 무시, 공백 무시 등의 옵션을 제공합니다.',
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
} satisfies Meta<typeof StringDiff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 문자열 비교 도구입니다. 두 텍스트를 입력하여 차이점을 확인할 수 있습니다.',
      },
    },
  },
};

export const WithSampleTexts: Story = {
  args: {
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '샘플 텍스트가 미리 입력된 상태의 문자열 비교 도구입니다.',
      },
    },
  },
  render: (args) => {
    return (
      <div>
        <StringDiff {...args} />
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>샘플 사용법:</strong></p>
          <p>1. 왼쪽(텍스트 A)에 "Hello World"를 입력</p>
          <p>2. 오른쪽(텍스트 B)에 "Hello Beautiful World"를 입력</p>
          <p>3. 차이점이 하이라이트되어 표시됩니다</p>
        </div>
      </div>
    );
  },
};

export const CodeComparison: Story = {
  args: {
    className: 'w-full max-w-4xl',
  },
  parameters: {
    docs: {
      description: {
        story: '코드 비교에 유용한 예시입니다. 줄 단위 비교 모드로 설정하여 코드 변경사항을 확인할 수 있습니다.',
      },
    },
  },
  render: (args) => {
    return (
      <div>
        <StringDiff {...args} />
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <p><strong>코드 비교 예시:</strong></p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="font-medium">텍스트 A (기존 코드):</p>
              <pre className="text-xs bg-white p-2 rounded border mt-1">{`function hello() {
  console.log('Hello');
  return true;
}`}</pre>
            </div>
            <div>
              <p className="font-medium">텍스트 B (수정된 코드):</p>
              <pre className="text-xs bg-white p-2 rounded border mt-1">{`function hello(name) {
  console.log('Hello ' + name);
  return name ? true : false;
}`}</pre>
            </div>
          </div>
          <p className="mt-2 text-xs">위의 코드를 각각 복사하여 붙여넣고 "줄" 모드로 비교해보세요.</p>
        </div>
      </div>
    );
  },
};

export const CompactView: Story = {
  args: {
    className: 'w-full max-w-2xl',
  },
  parameters: {
    docs: {
      description: {
        story: '더 작은 크기로 표시된 문자열 비교 도구입니다.',
      },
    },
  },
};
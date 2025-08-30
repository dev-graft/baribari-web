import type { Meta, StoryObj } from '@storybook/react';
import Base64Converter from './Base64Converter';

const meta: Meta<typeof Base64Converter> = {
  title: 'Tools/Base64Converter',
  component: Base64Converter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '문자열과 Base64 간의 상호 변환을 지원하는 도구입니다. 인코딩과 디코딩 모드를 전환할 수 있고, 실시간으로 변환 결과를 확인할 수 있습니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      description: '추가 CSS 클래스',
      control: 'text'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 Base64 변환기입니다. 인코딩 모드가 기본으로 선택되어 있습니다.'
      }
    }
  }
};

// 디코딩 모드
export const DecodeMode: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '디코딩 모드로 설정된 상태입니다. Base64 문자열을 일반 텍스트로 변환할 수 있습니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    // 디코딩 모드로 전환하는 로직을 시뮬레이션
    const canvas = canvasElement;
    const decodeButton = canvas.querySelector('button:contains("Base64 → 문자열")');
    if (decodeButton) {
      decodeButton.click();
    }
  }
};

// 입력 텍스트가 있는 상태
export const WithInputText: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '사용자가 텍스트를 입력한 상태입니다. 실시간으로 Base64 변환 결과가 표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value = '안녕하세요! 이것은 테스트 텍스트입니다.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 에러 상태
export const WithError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '유효하지 않은 Base64 문자열을 입력했을 때의 에러 상태입니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    
    // 디코딩 모드로 전환
    const decodeButton = canvas.querySelector('button:contains("Base64 → 문자열")');
    if (decodeButton) {
      decodeButton.click();
    }
    
    // 유효하지 않은 Base64 문자열 입력
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value = 'invalid-base64-string!@#';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 복사 기능이 활성화된 상태
export const CopyActive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '복사 버튼이 클릭된 상태입니다. 체크 아이콘이 표시되어 복사가 완료되었음을 나타냅니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    
    // 텍스트 입력
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value = '복사 테스트 텍스트';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // 복사 버튼 클릭
    const copyButton = canvas.querySelector('button[title="입력 텍스트 복사"]');
    if (copyButton) {
      copyButton.click();
    }
  }
};

// 입출력 바꾸기 버튼이 표시된 상태
export const WithSwapButton: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '변환 결과가 있을 때 입출력 바꾸기 버튼이 표시됩니다. 이 버튼을 통해 변환된 결과를 새로운 입력으로 사용할 수 있습니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    
    // 텍스트 입력하여 변환 결과 생성
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value = '입출력 바꾸기 테스트';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 긴 텍스트 입력 상태
export const LongTextInput: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '긴 텍스트를 입력했을 때의 상태입니다. Base64 변환 결과도 함께 표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    
    const longText = `이것은 매우 긴 텍스트입니다. 
    
여러 줄에 걸쳐 작성된 텍스트로, Base64 변환기의 성능을 테스트하기 위한 것입니다.

특수문자도 포함되어 있습니다: !@#$%^&*()_+-=[]{}|;':",./<>?

한글과 영어가 혼합된 텍스트도 정상적으로 처리되는지 확인할 수 있습니다.

이런 긴 텍스트를 Base64로 변환하면 상당히 긴 문자열이 생성될 것입니다.`;

    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value = longText;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 모든 기능이 활성화된 상태
export const FullyLoaded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '모든 기능이 활성화된 완전한 상태입니다. 인코딩, 디코딩, 복사, 입출력 바꾸기 등 모든 기능을 확인할 수 있습니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    
    // 텍스트 입력
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      textarea.value = '완전한 기능 테스트';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // 잠시 후 디코딩 모드로 전환
    setTimeout(() => {
      const decodeButton = canvas.querySelector('button:contains("Base64 → 문자열")');
      if (decodeButton) {
        decodeButton.click();
      }
    }, 1000);
  }
};

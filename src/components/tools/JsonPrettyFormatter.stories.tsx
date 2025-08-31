import type { Meta, StoryObj } from '@storybook/react';
import JsonPrettyFormatter from './JsonPrettyFormatter';

const meta: Meta<typeof JsonPrettyFormatter> = {
  title: 'Tools/JsonPrettyFormatter',
  component: JsonPrettyFormatter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'JSON 문자열을 읽기 쉽게 포맷팅하거나 압축하는 도구입니다. 실시간으로 JSON 유효성을 검증하고, 다양한 들여쓰기 옵션을 제공합니다.'
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
        story: '기본 상태의 JSON Pretty Formatter입니다. 왼쪽에 JSON을 입력하면 오른쪽에 포맷된 결과가 표시됩니다.'
      }
    }
  }
};

// 간단한 JSON 입력 상태
export const WithSimpleJson: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '간단한 JSON 객체를 입력한 상태입니다. 자동으로 포맷팅되어 오른쪽에 표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const simpleJson = '{"name":"홍길동","age":30,"city":"서울"}';
      textarea.value = simpleJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 복잡한 JSON 입력 상태
export const WithComplexJson: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '복잡한 중첩 구조의 JSON을 입력한 상태입니다. 배열과 객체가 포함된 구조도 깔끔하게 포맷팅됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const complexJson = '{"users":[{"id":1,"name":"김철수","profile":{"email":"kim@example.com","phone":"010-1234-5678","address":{"city":"서울","district":"강남구"}}},{"id":2,"name":"이영희","profile":{"email":"lee@example.com","phone":"010-9876-5432","address":{"city":"부산","district":"해운대구"}}}],"metadata":{"version":"1.0","lastUpdated":"2024-01-15T10:30:00Z"}}';
      textarea.value = complexJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 압축된 JSON 입력 상태
export const WithMinifiedJson: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '압축된(minified) JSON을 입력했을 때의 상태입니다. 읽기 어려운 한 줄 JSON이 깔끔하게 포맷팅됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const minifiedJson = '{"products":[{"id":1,"name":"노트북","price":1500000,"specs":{"cpu":"Intel i7","ram":"16GB","storage":"512GB SSD"},"tags":["컴퓨터","전자제품","업무용"]},{"id":2,"name":"마우스","price":50000,"specs":{"type":"무선","dpi":"3200","battery":"충전식"},"tags":["컴퓨터","액세서리","무선"]}],"total":2,"currency":"KRW"}';
      textarea.value = minifiedJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// JSON 구문 오류 상태
export const WithJsonError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '잘못된 JSON 형식을 입력했을 때의 오류 상태입니다. 오른쪽에 에러 메시지가 표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const invalidJson = '{"name":"홍길동","age":30,"city":"서울",}'; // 마지막 쉼표가 문제
      textarea.value = invalidJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 중괄호 누락 오류
export const WithBraceError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '중괄호가 누락된 잘못된 JSON 형식입니다. 구문 오류가 감지되어 오류 메시지가 표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const invalidJson = '"name":"홍길동","age":30'; // 중괄호 없음
      textarea.value = invalidJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 따옴표 오류
export const WithQuoteError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '따옴표가 잘못된 JSON 형식입니다. 키나 값에 잘못된 따옴표 사용으로 인한 오류를 표시합니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const invalidJson = "{name:'홍길동','age':30}"; // 작은따옴표 사용
      textarea.value = invalidJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 복사 기능 활성화 상태
export const WithCopyFunction: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '포맷된 JSON이 있을 때 복사 버튼이 활성화된 상태입니다. 버튼을 클릭하면 클립보드에 복사됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const jsonData = '{"message":"클립보드 복사 테스트","timestamp":"2024-01-15T10:30:00Z","success":true}';
      textarea.value = jsonData;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 통계 정보 표시 상태
export const WithStatistics: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'JSON 포맷팅 후 통계 정보가 표시된 상태입니다. 원본과 포맷된 JSON의 길이, 줄 수 등을 비교할 수 있습니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const jsonData = '{"users":[{"id":1,"name":"김철수","email":"kim@example.com"},{"id":2,"name":"이영희","email":"lee@example.com"},{"id":3,"name":"박민수","email":"park@example.com"}],"total":3,"page":1,"limit":10}';
      textarea.value = jsonData;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 들여쓰기 4칸 상태
export const WithIndent4: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '4칸 들여쓰기로 포맷팅된 상태입니다. 기본 2칸보다 더 넓은 들여쓰기를 사용합니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const jsonData = '{"config":{"server":{"host":"localhost","port":3000},"database":{"host":"db.example.com","port":5432,"name":"myapp"}}}';
      textarea.value = jsonData;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      // 들여쓰기 4칸 버튼 클릭
      setTimeout(() => {
        const indent4Button = canvas.querySelector('button:contains("들여쓰기 4")');
        if (indent4Button) {
          indent4Button.click();
        }
      }, 500);
    }
  }
};

// 배열 중심 JSON
export const WithArrayJson: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '배열이 루트인 JSON 구조입니다. 객체 배열이 깔끔하게 포맷팅되어 표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const arrayJson = '[{"name":"사과","price":2000,"category":"과일"},{"name":"당근","price":1500,"category":"채소"},{"name":"우유","price":3000,"category":"유제품"}]';
      textarea.value = arrayJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

// 빈 객체/배열 포함
export const WithEmptyStructures: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '빈 객체와 배열이 포함된 JSON입니다. null 값과 빈 구조도 적절히 처리됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const textarea = canvas.querySelector('textarea');
    if (textarea) {
      const emptyJson = '{"data":[],"metadata":{},"error":null,"success":true,"count":0}';
      textarea.value = emptyJson;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
};

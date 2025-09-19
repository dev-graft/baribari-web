import type { Meta, StoryObj } from '@storybook/react';
import SlackEmojiGenerator from './SlackEmojiGenerator';

const meta: Meta<typeof SlackEmojiGenerator> = {
  title: 'Tools/SlackEmojiGenerator',
  component: SlackEmojiGenerator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '이미지를 Slack 이모지로 변환하는 도구입니다. 이미지를 정사각형으로 크롭하고 적절한 크기로 리사이즈하여 Slack에서 사용할 수 있는 이모지를 생성합니다.'
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
        story: '기본 상태의 Slack 이모지 생성기입니다. 이미지를 드래그 앤 드롭하거나 파일 선택 버튼을 통해 업로드할 수 있습니다.'
      }
    }
  }
};

// 드래그 활성화 상태
export const DragActive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '파일을 드래그하고 있을 때의 상태입니다. 드롭 영역이 강조표시됩니다.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const dropzone = canvas.querySelector('[onDragEnter]');
    if (dropzone) {
      // 드래그 이벤트 시뮬레이션
      const dragEvent = new DragEvent('dragenter', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });
      dropzone.dispatchEvent(dragEvent);
    }
  }
};

// 로딩 상태
export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이미지를 처리하고 있을 때의 로딩 상태입니다.'
      }
    }
  }
};

// 이모지 이름 입력 상태
export const WithEmojiName: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이모지 이름을 입력한 상태입니다. 이 이름은 Slack에서 이모지를 사용할 때 `:이모지이름:` 형태로 사용됩니다.'
      }
    }
  }
};

// 크기 선택 상태
export const SizeSelection: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이모지 크기를 선택할 수 있는 상태입니다. 128x128px가 Slack에서 권장하는 크기입니다.'
      }
    }
  }
};

// 미리보기 표시 상태
export const WithPreview: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이미지가 업로드되어 원본과 처리된 이미지를 미리볼 수 있는 상태입니다.'
      }
    }
  }
};

// 다운로드 준비 완료 상태
export const ReadyToDownload: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이모지 처리가 완료되어 다운로드와 Slack 업로드 가이드를 확인할 수 있는 상태입니다.'
      }
    }
  }
};

// 에러 상태 - 잘못된 파일 형식
export const InvalidFileType: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이미지가 아닌 파일을 업로드했을 때의 에러 상태입니다.'
      }
    }
  }
};

// 에러 상태 - 파일 크기 초과
export const FileTooLarge: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '10MB를 초과하는 파일을 업로드했을 때의 에러 상태입니다.'
      }
    }
  }
};

// 복사 완료 상태
export const CopyComplete: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Slack 업로드 가이드가 클립보드에 복사된 상태입니다. 체크 아이콘이 표시됩니다.'
      }
    }
  }
};

// 완전한 워크플로우 상태
export const CompleteWorkflow: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '전체 워크플로우가 완료된 상태입니다. 이미지 업로드부터 처리, 미리보기, 다운로드까지 모든 단계를 확인할 수 있습니다.'
      }
    }
  }
};

// 다양한 크기 비교
export const SizeComparison: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '128px, 64px, 32px 크기의 이모지를 비교해볼 수 있는 상태입니다.'
      }
    }
  }
};

// 특수 문자가 포함된 이모지 이름
export const SpecialCharacterName: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '특수 문자가 포함된 파일명이 자동으로 정리되어 유효한 이모지 이름으로 변환되는 상태입니다.'
      }
    }
  }
};
import type { Meta, StoryObj } from '@storybook/react';
import AsciiArtGenerator from './AsciiArtGenerator';

const meta: Meta<typeof AsciiArtGenerator> = {
  title: 'Tools/AsciiArtGenerator',
  component: AsciiArtGenerator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '이미지를 ASCII 아트로 변환하는 도구입니다. 다양한 문자 세트와 설정 옵션을 제공하여 원하는 스타일의 텍스트 아트를 생성할 수 있습니다.'
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
        story: '기본 상태의 ASCII 아트 생성기입니다. 이미지를 드래그 앤 드롭하거나 파일 선택 버튼을 통해 업로드할 수 있습니다.'
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
  }
};

// 로딩 상태
export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이미지를 ASCII 아트로 변환하고 있을 때의 로딩 상태입니다.'
      }
    }
  }
};

// 설정 패널 표시 상태
export const WithSettings: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '이미지가 업로드되어 설정 패널이 표시된 상태입니다. 너비, 문자 세트, 대비 등을 조정할 수 있습니다.'
      }
    }
  }
};

// ASCII 문자 세트
export const AsciiCharacterSet: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 ASCII 문자 세트(@%#*+=-:. )를 사용한 상태입니다. 가장 일반적인 ASCII 아트 스타일입니다.'
      }
    }
  }
};

// 확장 문자 세트
export const ExtendedCharacterSet: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '확장 문자 세트(█▉▊▋▌▍▎▏ )를 사용한 상태입니다. 더 부드러운 그라데이션 효과를 제공합니다.'
      }
    }
  }
};

// 단순 문자 세트
export const SimpleCharacterSet: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '단순 문자 세트(█▓▒░ )를 사용한 상태입니다. 간단하고 깔끔한 스타일의 ASCII 아트를 생성합니다.'
      }
    }
  }
};

// 블록 문자 세트
export const BlockCharacterSet: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '블록 문자 세트(██▓▒░  )를 사용한 상태입니다. 더 굵고 선명한 ASCII 아트를 생성합니다.'
      }
    }
  }
};

// 커스텀 문자 세트
export const CustomCharacterSet: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '사용자 정의 문자 세트를 사용한 상태입니다. 원하는 문자들을 입력하여 독특한 스타일의 ASCII 아트를 만들 수 있습니다.'
      }
    }
  }
};

// 너비 설정 - 작은 크기
export const SmallWidth: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '너비가 작게 설정된 상태입니다 (20-50 문자). 간단하고 빠른 ASCII 아트 생성에 적합합니다.'
      }
    }
  }
};

// 너비 설정 - 큰 크기
export const LargeWidth: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '너비가 크게 설정된 상태입니다 (150-200 문자). 더 세밀하고 정교한 ASCII 아트를 생성할 수 있습니다.'
      }
    }
  }
};

// 대비 조정 - 낮은 대비
export const LowContrast: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '대비가 낮게 설정된 상태입니다 (10-30%). 부드럽고 은은한 ASCII 아트 효과를 만듭니다.'
      }
    }
  }
};

// 대비 조정 - 높은 대비
export const HighContrast: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '대비가 높게 설정된 상태입니다 (150-200%). 선명하고 극적인 ASCII 아트 효과를 만듭니다.'
      }
    }
  }
};

// 결과 출력 상태
export const WithResult: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'ASCII 아트 변환이 완료되어 결과가 표시된 상태입니다. 복사 및 다운로드 버튼을 사용할 수 있습니다.'
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
        story: 'ASCII 아트가 클립보드에 복사된 상태입니다. 체크 아이콘이 표시됩니다.'
      }
    }
  }
};

// 문자 미리보기 표시
export const CharacterPreview: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '선택된 문자 세트의 미리보기가 표시된 상태입니다. 각 문자가 어떻게 사용되는지 확인할 수 있습니다.'
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
        story: '전체 워크플로우가 완료된 상태입니다. 이미지 업로드부터 설정 조정, ASCII 아트 생성, 결과 확인까지 모든 단계를 보여줍니다.'
      }
    }
  }
};
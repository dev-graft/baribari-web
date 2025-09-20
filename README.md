# 바리바리 (Baribari) - 웹 유틸리티 허브

[바리바리](https://baribari.devgraft.com/)는 개발자와 일반 사용자를 위한 다양한 변환/도구 기능을 제공하는 웹 유틸리티 허브입니다.

## 🚀 주요 기능

- **다양한 도구**: 단위 변환, JSON 포맷터, Base64 변환, 타임스탬프 변환, Cron 파서 등
- **사용자 인증**: 구글 로그인 등을 통한 계정 관리
- **사용 이력**: 로그인 사용자의 도구 사용 기록 관리
- **대시보드**: 기능 사용량을 그래프로 시각화
- **반응형 디자인**: 모바일과 데스크톱에서 최적화된 사용자 경험

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + 커스텀 컴포넌트
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Development**: ESLint + Prettier + Storybook

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── layout/         # 레이아웃 관련 컴포넌트
│       ├── Header.tsx  # 헤더 컴포넌트
│       ├── Footer.tsx  # 푸터 컴포넌트
│       └── Layout.tsx  # 메인 레이아웃
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx    # 홈페이지
│   ├── ToolsPage.tsx   # 도구 목록 페이지
│   ├── ToolDetailPage.tsx # 도구 상세 페이지
│   ├── LoginPage.tsx   # 로그인 페이지
│   └── DashboardPage.tsx # 대시보드 페이지
├── hooks/              # 커스텀 훅
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx            # 애플리케이션 진입점
└── index.css           # 글로벌 스타일
```

## 🎨 컴포넌트 및 스토리북

### Layout 컴포넌트

#### Header 컴포넌트
- **파일**: `src/components/layout/Header.tsx`
- **스토리북**: `src/components/layout/Header.stories.tsx`
- **기능**: 네비게이션, 로그인 상태, 모바일 메뉴
- **Props**: 없음 (내부 상태 관리)

**사용 예시:**
```tsx
import Header from './components/layout/Header';

function App() {
  return (
    <div>
      <Header />
      {/* 메인 콘텐츠 */}
    </div>
  );
}
```

#### Footer 컴포넌트
- **파일**: `src/components/layout/Footer.tsx`
- **스토리북**: `src/components/layout/Footer.stories.tsx`
- **기능**: 저작권 정보, 빠른 링크, 지원 정보
- **Props**: 없음

#### Layout 컴포넌트
- **파일**: `src/components/layout/Layout.tsx`
- **기능**: 헤더, 푸터, 메인 콘텐츠 영역을 포함한 전체 레이아웃
- **Props**: 없음 (React Router의 Outlet 사용)

### 페이지 컴포넌트

#### HomePage
- **파일**: `src/pages/HomePage.tsx`
- **기능**: 서비스 소개, 인기 도구, 주요 특징
- **Props**: 없음

#### ToolsPage
- **파일**: `src/pages/ToolsPage.tsx`
- **기능**: 모든 도구 목록, 검색, 카테고리 필터링
- **Props**: 없음

#### ToolDetailPage
- **파일**: `src/pages/ToolDetailPage.tsx`
- **기능**: 선택된 도구의 상세 정보와 기능
- **Props**: URL 파라미터 (toolId)

#### LoginPage
- **파일**: `src/pages/LoginPage.tsx`
- **기능**: 이메일/비밀번호 로그인, 구글 OAuth
- **Props**: 없음

#### DashboardPage
- **파일**: `src/pages/DashboardPage.tsx`
- **기능**: 사용 통계, 차트, 최근 활동
- **Props**: 없음

## 🚀 개발 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 스토리북 실행
```bash
npm run storybook
```

### 5. 린트 및 타입 체크
```bash
npm run lint
npm run type-check
```

## 📊 사용 가능한 도구

### 변환기 (Converter)
- **단위 변환**: 길이, 무게, 온도 등
- **색상 변환**: HEX, RGB, HSL 등
- **Base64 변환**: 텍스트 ↔ Base64 인코딩
- **URL 인코더**: URL 인코딩/디코딩

### 포맷터 (Formatter)
- **JSON 포맷터**: JSON 데이터 포맷팅/압축
- **텍스트 케이스 변환**: 대문자, 소문자, 카멜케이스 등

### 시간/날짜 (Time/Date)
- **타임스탬프 변환**: Unix 타임스탬프 ↔ 날짜
- **Cron 파서**: Cron 표현식 파싱 및 다음 실행 시각

## 🎯 개발 컨벤션

### 코드 스타일
- **컴포넌트**: 함수형 컴포넌트 + Hooks
- **파일명**: kebab-case
- **컴포넌트명**: PascalCase
- **상태 관리**: 로컬 훅 우선, 전역 상태 최소화

### 스타일링
- **CSS 프레임워크**: Tailwind CSS
- **컴포넌트**: shadcn/ui 스타일 (유사 대체 가능)
- **반응형**: 모바일 퍼스트 접근법

### 품질 관리
- **린터**: ESLint + Prettier
- **타입 체크**: TypeScript strict 모드
- **스토리북**: 모든 컴포넌트에 대한 문서화

## 🔧 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 9+ 또는 yarn 1.22+

### 환경 변수
```env
# 개발 환경
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📝 API 문서

### 인증 API
- `POST /auth/login` - 이메일/비밀번호 로그인
- `POST /auth/google` - 구글 OAuth 로그인
- `POST /auth/logout` - 로그아웃

### 도구 API
- `GET /tools` - 도구 목록 조회
- `GET /tools/:id` - 도구 상세 정보
- `POST /tools/:id/usage` - 도구 사용 기록

### 사용자 API
- `GET /user/profile` - 사용자 프로필
- `GET /user/history` - 사용 이력
- `GET /user/stats` - 사용 통계

## 🤝 기여하기

1. 이슈 생성 또는 기존 이슈 확인
2. 기능 브랜치 생성 (`feature/기능명`)
3. 코드 작성 및 테스트
4. Pull Request 생성
5. 코드 리뷰 및 머지

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 팀

**devgraft** 팀에서 개발하고 있습니다.

---

더 자세한 정보는 [Wiki](https://github.com/devgraft/baribari-web/wiki)를 참조하세요.

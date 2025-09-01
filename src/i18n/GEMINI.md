알겠습니다. 분석된 내용을 바탕으로 국제화(i18n) 아키텍처 설계 명세서를 한국어로 작성해 드리겠습니다.

  ---

  디자인 명세서: 국제화(i18n) 아키텍처

   * 날짜: 2025년 9월 1일
   * 페르소나: 프론트엔드 아키텍트
   * 상태: 제안

  본 문서는 바리바리(Baribari) 웹 애플리케이션을 위한 확장 가능하고, 유지보수 용이하며, 사용자 중심적인 국제화(i18n) 시스템의 아키텍처 설계를
  기술합니다. 이 설계는 기존의 react-i18next 구현을 기반으로 하며, 성능과 장기적인 성장을 위한 핵심적인 개선 사항을 도입합니다.

  1. 시스템 아키텍처 명세

  1.1. 컴포넌트 및 데이터 흐름도

  제안하는 아키텍처는 모든 번역 파일을 번들링하는 방식에서 동적으로 로드하는 방식으로 전환합니다.

   1 [사용자 액션: 언어 선택]
   2        ↓
   3 [LanguageSelector.tsx] -- i18n.changeLanguage('en') 호출 --> [i18next 인스턴스]
   4                                                                     ↓ (언어 변경 트리거)
   5 [i18next-http-backend] -- '/locales/en.json' 요청 --> [웹 서버]
   6        ↓ (파일 수신)                                       ↑
   7 [i18next 인스턴스] -- 번역 업데이트 및 리렌더링 --> [useTranslation을 사용하는 React 컴포넌트들]
   8        ↓
   9 [App.tsx Effect] -- <html> 태그 업데이트 --> [<html lang="en">]

  핵심 변경사항: 번역 파일(*.json)은 더 이상 애플리케이션 번들에 직접 포함되지 않고, 런타임에 요청되는 정적 자산(static assets)으로 취급됩니다.

  1.2. 확장성 계획

  번역 파일을 모두 번들링하는 현재 접근 방식은 확장성이 떨어집니다. 10개의 언어를 지원하게 되면 초기 로드 크기가 상당히 증가할 것입니다. 10배의
   성장(예: 20개 이상의 언어)에 대비하기 위해 동적 로딩(dynamic loading)을 구현합니다.

   * 전략: i18next-http-backend 플러그인을 사용하여 필요할 때 네트워크를 통해 번역 파일을 가져옵니다.
   * 장점: 지원하는 언어 수에 관계없이 초기 번들 크기가 일정하게 유지됩니다. 사용자는 자신이 사용하는 언어 파일만 다운로드하므로 초기 페이지
     로드 성능(Core Web Vitals)이 크게 향상됩니다.
   * 미래 성장: 매우 큰 규모(50개 이상의 언어, 복잡한 번역 승인 워크플로우)로 확장될 경우, 이 아키텍처는 CDN을 통해 JSON 파일을 제공할 수 있는
     번역 관리 시스템(TMS)(예: Crowdin, Lokalise)과 원활하게 통합될 수 있습니다.

  1.3. 기술 스택 결정

   * 핵심 라이브러리 (변경 없음): react-i18next. 성숙도, 풍부한 기능, React Hooks에 대한 완벽한 지원 덕분에 계속해서 올바른 선택입니다.
   * 언어 감지 (변경 없음): i18next-browser-languagedetector. 언어 감지 및 localStorage 캐싱에 대한 현재 설정은 최적이며 그대로 유지합니다.
   * 신규 플러그인: i18next-http-backend. 번역 파일의 동적 로딩을 처리하기 위해 이 플러그인을 추가합니다.

  1.4. 통합 패턴

   * Vite 통합: src/i18n/locales에 있는 번역 파일들은 정적 자산으로 취급되어야 합니다. Vite 네이티브 방식 중 가장 간단한 것은 이 파일들을 public
      디렉토리(예: public/locales)로 옮기는 것입니다. 이렇게 하면 빌드 결과물에 파일들이 복사되어 예측 가능한 URL(예: /locales/en.json)로 제공될
      수 있습니다.

  2. API 및 데이터 모델 디자인

  2.1. 컴포넌트 API

   * 주요 인터페이스: useTranslation 훅은 컴포넌트가 번역 함수(t)와 i18n 인스턴스에 접근하는 표준 방식으로 유지됩니다.
   * 사용 컨벤션: 컴포넌트 내의 모든 사용자 대상 텍스트는 반드시 t() 함수를 사용하여 렌더링해야 합니다. 하드코딩된 문자열은 허용되지 않습니다.
       * 예시: <h1>{t('header.title')}</h1>

  2.2. 데이터 모델 (번역 파일)

   * 구조 (변경 없음): 기존의 중첩된 JSON 객체 구조는 유지보수성에 매우 좋습니다. 기능 또는 컴포넌트별로 키를 그룹화하는 방식(예: header,
     tools.base64, footer)을 계속 사용합니다.
   * 키 명명 컨벤션: 예측 가능성을 보장하기 위해 일관된 feature.component.element 또는 page.section.key 패턴을 채택합니다.

  2.3. 상태 관리 및 영속성

   * 언어 설정 유지 (변경 없음): i18next-browser-languagedetector를 통해 localStorage를 사용하는 것은 사용자가 선택한 언어를 세션 간에 기억하는
     올바른 방법이며, 그대로 유지합니다.
   * 접근성 및 SEO 향상: 애플리케이션은 현재 언어와 일치하도록 <html> 태그의 lang 속성을 동적으로 업데이트 해야 합니다. 이는 스크린 리더와 검색
     엔진 최적화에 매우 중요합니다.

  2.4. 에러 핸들링

   * 누락된 키: 개발 중에는 누락된 키가 눈에 잘 띄어야 합니다. 프로덕션 환경에서는 UI가 자연스럽게 대체 처리되어야 합니다.
       * 설정: fallbackLng: 'en' (또는 다른 기본 언어)으로 설정합니다. 이를 통해 현재 언어에 번역이 누락된 경우, UI가 깨지는 대신 영어 텍스트가
         표시되도록 보장합니다.
       * 디버깅: i18next는 개발 모드(debug: true)에서 누락된 키를 콘솔에 기록하므로, 이를 통해 에러를 충분히 파악할 수 있습니다.

  3. 사용자 인터페이스(UI) 아키텍처

  3.1. 컴포넌트 계층 구조

   * `LanguageSelector.tsx`: 이 컴포넌트는 잘 설계되어 있습니다.
       * 개선 제안: 유지보수성을 높이기 위해 하드코딩된 languages 배열을 제거하는 것이 좋습니다. 컴포넌트는 사전에 선언된
         i18next.options.resources 키나 별도의 설정 파일로부터 사용 가능한 언어 목록을 동적으로 가져올 수 있습니다. i18next-http-backend 접근
         방식에서는 작은 설정 파일을 유지하거나 배열을 그대로 두는 것도 허용됩니다.

  3.2. 접근성 프레임워크

   * `LanguageSelector` (변경 없음): 컴포넌트는 aria-label과 함께 <button>을 올바르게 사용하여 접근성을 준수하고 있습니다.
   * 필수 개선 사항: 언어 변경 시 document.documentElement.lang을 업데이트하는 로직을 구현해야 합니다. 이는 App.tsx와 같은 최상위 컴포넌트에서
     수행할 수 있습니다.
    1 // App.tsx 내부
    2 import { useTranslation } from 'react-i18next';
    3 
    4 function App() {
    5   const { i18n } = useTranslation();
    6 
    7   useEffect(() => {
    8     document.documentElement.lang = i18n.language;
    9   }, [i18n.language]);
   10 
   11   // ... 컴포넌트의 나머지 부분
   12 }

  3.3. 성능 아키텍처

   * 주요 성능 향상은 번역 파일의 지연 로딩(lazy loading)에서 비롯됩니다. 모든 언어를 번들링하지 않음으로써 초기 JavaScript 페이로드를 줄여
     Time to Interactive(TTI)를 단축하고 더 나은 Lighthouse 점수를 얻을 수 있습니다. 이는 Core Web Vitals 이니셔티브를 직접적으로 지원합니다.

  4. 구현 가이드

  4.1. 개발 로드맵

   1. 의존성 설치:
   1     npm install i18next-http-backend
   2. locales 디렉토리 이동: src/i18n/locales 디렉토리를 public/locales로 이동합니다.
   3. i18n 설정 업데이트 (`src/i18n/index.ts`):
       * en.json과 ko.json의 직접적인 import 구문을 제거합니다.
       * HttpApi를 추가하고 설정합니다.

    1     import i18n from 'i18next';
    2     import { initReactI18next } from 'react-i18next';
    3     import LanguageDetector from 'i18next-browser-languagedetector';
    4     import HttpApi from 'i18next-http-backend';
    5 
    6     i18n
    7       .use(HttpApi) // HTTP 백엔드 사용
    8       .use(LanguageDetector)
    9       .use(initReactI18next)
   10       .init({
   11         // 'resources' 키 제거
   12         fallbackLng: 'en', // 'en'과 같은 합리적인 기본값 설정
   13         debug: process.env.NODE_ENV === 'development',
   14         interpolation: {
   15           escapeValue: false,
   16         },
   17         detection: {
   18           order: ['localStorage', 'navigator', 'htmlTag'],
   19           caches: ['localStorage'],
   20         },
   21         // 백엔드 옵션
   22         backend: {
   23           loadPath: '/locales/{{lng}}.json', // 번역 파일 경로
   24         },
   25       });
   26 
   27     export default i18n;
   4. 접근성 개선 사항 구현: 3.2절에 설명된 useEffect 훅을 App.tsx에 추가합니다.
   5. 코드베이스 리팩토링: 모든 컴포넌트를 감사하여 하드코딩된 사용자 대상 문자열이 없는지 확인하고, 모두 t() 함수를 사용하도록 변환합니다.

  4.2. 품질 게이트

   * 린팅(Linting): eslint-plugin-i18next와 같은 정적 분석 도구를 추가하여 JSX 내의 하드코딩된 문자열을 탐지하고 재발을 방지하는 것을
     고려합니다.
   * 테스팅:
       * Storybook: 테스터와 개발자가 모든 컴포넌트 스토리의 언어를 쉽게 전환할 수 있는 글로벌 데코레이터를 만들어 시각적 검증을 용이하게
         합니다.
       * 유닛 테스트: useTranslation을 사용하는 컴포넌트를 테스트할 때, 훅을 모킹(mocking)하여 테스트별 번역을 제공하고 컴포넌트가 이를
         올바르게 렌더링하는지 확인합니다.

  4.3. 리스크 완화

   * 리스크: 네트워크 오류로 인해 언어 파일 다운로드가 실패하는 경우.
       * 완화 방안: fallbackLng 설정이 강력한 대체 수단을 제공합니다. 사용자는 충돌 대신 기본 언어로 된 UI를 보게 됩니다.
   * 리스크: 번역가가 많은 수의 JSON 파일을 관리하기 어려워지는 경우.
       * 완화 방안: 미래의 성장을 위해 TMS로의 전환을 계획합니다. 제안된 아키텍처는 TMS가 관리하는 CDN을 가리키도록 backend 설정의 loadPath만
         변경하면 되므로 완벽하게 호환됩니다.

  4.4. 성공 지표

   * 성능: 새로운 언어가 추가되어도 초기 JS 번들 크기가 증가하지 않습니다.
   * 유지보수성: 새로운 언어를 추가할 때 public/locales에 새 JSON 파일을 추가하는 것만으로 충분하며(선택기 배열이 하드코딩된 경우 업데이트
     필요), 핵심 애플리케이션 로직 변경은 필요 없습니다.
   * 사용자 경험: <html> 태그의 lang 속성이 올바르게 설정되어 접근성이 향상됩니다.
   * 코드 품질: 린트 규칙이 코드베이스에 새로운 하드코딩 문자열이 추가되는 것을 성공적으로 방지합니다.
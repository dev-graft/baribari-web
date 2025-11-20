# 바리바리 프로젝트 사용자 추적 구현 계획

## 해야 할 일 (Action Items)

### 1. 데이터 수집 아키텍처 설계
- [ ] 원천 데이터 스키마 정의
- [ ] 익명 사용자 식별 시스템 구현
- [ ] 로그인 시 계정 연결 로직 개발
- [ ] 데이터 파이프라인 구축 (실시간 + 배치)

### 2. 프론트엔드 추적 시스템 구현
- [ ] 익명 사용자 ID 생성/관리 (`localStorage` + UUID)
- [ ] 브라우저 핑거프린팅 구현 (선택사항)
- [ ] 이벤트 수집 라이브러리 개발
- [ ] 쿠키 동의 관리 시스템

### 3. 백엔드 API 개발
- [ ] 이벤트 수집 엔드포인트
- [ ] 사용자 계정 연결 API
- [ ] 데이터 변환 및 집계 로직
- [ ] 개인정보 삭제/익명화 기능

### 4. 데이터베이스 설계
- [ ] 원천 이벤트 테이블
- [ ] 사용자 식별 매핑 테이블
- [ ] 집계 데이터 테이블 (대시보드용)
- [ ] 광고 타겟팅 데이터 테이블

### 5. 법적 컴플라이언스
- [ ] 개인정보보호 정책 작성
- [ ] 쿠키 정책 구현
- [ ] GDPR 삭제권 구현
- [ ] 데이터 보존 정책 설정

## 데이터 수집 가이드

### 필수 수집 이벤트

#### A. 페이지 네비게이션
```javascript
// 페이지 진입
trackEvent('page_view', {
  page: '/tools/base64-converter',
  referrer: document.referrer,
  entryPoint: 'tools_list' | 'search' | 'direct_url'
});

// 도구 페이지 진입
trackEvent('tool_page_enter', {
  toolId: 'base64-converter',
  toolCategory: 'converter'
});
```

#### B. 도구 사용 추적
```javascript
// 도구 사용 시작
trackEvent('tool_usage_start', {
  toolId: 'base64-converter',
  action: 'encode' | 'decode',
  inputMethod: 'paste' | 'type' | 'file_upload'
});

// 도구 사용 완료
trackEvent('tool_usage_complete', {
  toolId: 'base64-converter',
  action: 'encode',
  inputSize: 1024, // bytes
  processingTime: 150, // ms
  success: true,
  outputCopied: true
});

// 도구 사용 실패
trackEvent('tool_usage_error', {
  toolId: 'json-formatter',
  errorType: 'invalid_json' | 'network_error' | 'size_limit',
  errorMessage: 'Invalid JSON syntax at line 5'
});
```

#### C. 사용자 인터랙션
```javascript
// 버튼 클릭
trackEvent('button_click', {
  buttonType: 'convert' | 'clear' | 'copy' | 'download',
  location: 'tool_interface',
  toolId: 'url-encoder'
});

// 파일 업로드
trackEvent('file_upload', {
  toolId: 'base64-converter',
  fileSize: 2048,
  fileType: 'image/png',
  uploadMethod: 'drag_drop' | 'file_picker'
});
```

#### D. 광고 관련
```javascript
// 광고 노출
trackEvent('ad_impression', {
  adId: 'ad_123',
  adPosition: 'sidebar' | 'banner' | 'popup',
  toolContext: 'base64-converter',
  userSegment: 'power_user' | 'casual_user'
});

// 광고 클릭
trackEvent('ad_click', {
  adId: 'ad_123',
  adPosition: 'sidebar',
  toolContext: 'base64-converter'
});
```

### 원천 데이터 표준 스키마

```javascript
{
  // 메타데이터 (모든 이벤트 공통)
  timestamp: "2024-01-01T10:00:00Z",
  anonymousId: "anon_abc123",        // localStorage UUID
  fingerprint: "fp_xyz789",          // 브라우저 핑거프린트 (선택)
  userId: null,                      // 로그인 후에만 값 존재
  sessionId: "sess_456",
  
  // 이벤트 정보
  event: "tool_usage_complete",
  category: "tool_interaction",
  
  // 컨텍스트 정보
  page: "/tools/base64-converter",
  toolId: "base64-converter",
  
  // 이벤트별 상세 데이터
  eventData: {
    action: "encode",
    inputSize: 1024,
    processingTime: 150,
    success: true
  },
  
  // 기술적 메타데이터
  userAgent: "Mozilla/5.0...",
  deviceType: "desktop" | "mobile",
  country: "KR",
  language: "ko"
}
```

## 구현 우선순위

### Phase 1 (MVP)
1. 기본 익명 사용자 ID 생성 (localStorage)
2. 핵심 도구 사용 이벤트 수집
3. 간단한 대시보드 메트릭스 생성

### Phase 2 (고도화)
1. 브라우저 핑거프린팅 구현
2. 로그인 시 계정 연결 로직
3. 광고 관련 이벤트 수집
4. 쿠키 동의 관리

### Phase 3 (최적화)
1. Cross-device tracking
2. Probabilistic matching
3. 고급 사용자 세그멘테이션
4. 실시간 개인화

## 기술 스택 권장사항

### 프론트엔드
- 이벤트 수집: 커스텀 훅 (React)
- 저장소: localStorage (anonymousId), sessionStorage (sessionId)
- 쿠키 관리: js-cookie 라이브러리

### 백엔드
- 이벤트 수집: Express.js API
- 실시간 처리: Apache Kafka (선택사항)
- 배치 처리: Node.js cron jobs

### 데이터베이스
- 원천 데이터: PostgreSQL (시계열 데이터)
- 집계 데이터: Redis (캐시)
- 분석용: ClickHouse (선택사항)

### 분석 도구
- 대시보드: 자체 구현 (Recharts)
- 광고 분석: Google Analytics 4 (병행)

## 다음 단계
1. Phase 1 구현 시작
2. 개인정보보호 정책 검토
3. 법무팀과 컴플라이언스 확인
4. MVP 테스트 및 검증
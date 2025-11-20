# 바리바리 데이터 수집 스키마

## 분석 목표 & 활용 용도

### 핵심 활용 목표
1. **광고&마케팅**: OpenRTB 기반 AdEx, 타겟팅, RTB 입찰
2. **통계&대시보드**: DAU/MAU, 사용량 트렌드, 성과 지표  
3. **서비스 품질 향상**: A/B 테스트, 사용자 경험 개선
4. **비즈니스 KPI**: 가입/탈퇴 추이, 광고 노출/클릭 성과

## 원천 데이터 스키마 (Complete Version)

### 기본 식별자 & 메타데이터
```javascript
{
  // === 고유 식별자 ===
  "eventId": "evt_1704067200_abc123",      // 이벤트 고유 ID (중복 제거)
  "anonymousId": "anon_uuid_123",          // localStorage 기반 익명 ID
  "fingerprintId": "fp_browser_456",       // 브라우저 핑거프린트 ID
  "sessionId": "sess_789",                 // 세션 고유 ID
  "userId": null,                          // 로그인 시에만 값 존재
  
  // === 시간 정보 ===
  "timestamp": "2024-01-01T10:30:45.123Z", // UTC 타임스탬프
  "timezone": "Asia/Seoul",                 // 사용자 시간대
  "localTimestamp": "2024-01-01T19:30:45", // 로컬 시간
  
  // === 이벤트 분류 ===
  "eventType": "page_view",                // 이벤트 타입
  "eventCategory": "navigation",           // 이벤트 카테고리
  "action": "enter",                       // 구체적 액션
}
```

### 디바이스 & 기술 환경 (OpenRTB 필수)
```javascript
{
  // === 디바이스 정보 ===
  "deviceType": "desktop",                 // desktop|mobile|tablet
  "deviceBrand": "Apple",                  // 제조사
  "deviceModel": "MacBook Pro",            // 모델명
  
  // === OS 정보 ===
  "os": "macOS",                          // 운영체제
  "osVersion": "14.1.2",                 // OS 버전
  
  // === 브라우저 정보 ===
  "browser": "Chrome",                    // 브라우저명
  "browserVersion": "119.0.6045.105",    // 브라우저 버전
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
  
  // === 화면 정보 ===
  "screenWidth": 1920,                    // 화면 너비
  "screenHeight": 1080,                   // 화면 높이
  "viewportWidth": 1440,                  // 뷰포트 너비
  "viewportHeight": 900,                  // 뷰포트 높이
  "colorDepth": 24,                       // 색상 깊이
  "pixelRatio": 2.0,                      // 픽셀 비율
  
  // === 네트워크 정보 ===
  "connectionType": "wifi",               // wifi|cellular|ethernet
  "connectionSpeed": "4g",                // 연결 속도 (모바일)
}
```

### 지리적 & 언어 정보
```javascript
{
  // === 위치 정보 (IP 기반) ===
  "country": "KR",                        // ISO 국가 코드
  "countryName": "South Korea",           // 국가명
  "region": "Seoul",                      // 주/도
  "city": "Gangnam-gu",                   // 시/구
  "zipCode": "06292",                     // 우편번호
  "lat": 37.5665,                         // 위도 (대략적)
  "lon": 126.9780,                        // 경도 (대략적)
  
  // === 언어 정보 ===
  "language": "ko",                       // 주 언어
  "languages": ["ko-KR", "en-US"],        // 지원 언어 목록
  "acceptLanguage": "ko-KR,en-US;q=0.9,en;q=0.8"
}
```

### 페이지 & 컨텍스트 정보
```javascript
{
  // === 페이지 정보 ===
  "pageUrl": "/tools/base64-converter",    // 현재 페이지 URL
  "pageTitle": "Base64 인코더/디코더",      // 페이지 제목
  "pagePath": "/tools/base64-converter",   // URL 경로
  "pageQuery": "?utm_source=google",       // 쿼리 파라미터
  "pageHash": "#encode",                   // URL 해시
  
  // === 레퍼러 정보 ===
  "referrer": "https://www.google.com/search?q=base64+converter",
  "referrerDomain": "google.com",
  "referrerPath": "/search",
  
  // === 도구 컨텍스트 ===
  "toolId": "base64-converter",           // 도구 ID
  "toolName": "Base64 인코더/디코더",      // 도구명
  "toolCategory": "converter",            // 도구 카테고리
}
```

### 마케팅 & 어트리뷰션
```javascript
{
  // === UTM 파라미터 ===
  "utmSource": "google",                  // 유입 소스
  "utmMedium": "cpc",                     // 미디어 타입
  "utmCampaign": "base64_tools_2024",     // 캠페인명
  "utmContent": "ad_variant_a",           // 광고 콘텐츠
  "utmTerm": "base64 converter",          // 검색 키워드
  
  // === 세션 정보 ===
  "isNewSession": true,                   // 신규 세션 여부
  "sessionDuration": 300,                 // 세션 지속 시간 (초)
  "pageviewsInSession": 5,                // 세션 내 페이지뷰 수
  "isNewUser": false,                     // 신규 사용자 여부
  "userSegment": "returning_power_user",   // 사용자 세그먼트
  
  // === 행동 신호 ===
  "scrollDepth": 75,                      // 최대 스크롤 깊이 (%)
  "timeOnPage": 120,                      // 페이지 체류 시간 (초)
  "clickCount": 3,                        // 페이지 내 클릭 횟수
  "isBounce": false,                      // 바운스 여부
}
```

### 개인정보보호 & 광고 관련
```javascript
{
  // === 프라이버시 신호 ===
  "doNotTrack": false,                    // DNT 헤더
  "adBlockerDetected": false,             // 광고 차단기 감지
  "cookiesEnabled": true,                 // 쿠키 활성화
  "localStorageEnabled": true,            // localStorage 지원
  "gdprConsent": true,                    // GDPR 동의
  "consentString": "CPX...",              // IAB 동의 문자열
  
  // === 광고 관련 ===
  "adPersonalization": true,              // 개인화 광고 동의
  "ifa": "12345678-1234-5678-9abc-123456789abc", // 광고 식별자 (모바일)
  "limitAdTracking": false,               // 광고 추적 제한
}
```

### 서비스 정보
```javascript
{
  // === 앱 정보 ===
  "appVersion": "1.2.3",                  // 서비스 버전
  "buildNumber": "123",                   // 빌드 번호
  "deploymentId": "prod-2024-01-01",      // 배포 ID
  
  // === 실험 정보 (A/B 테스트) ===
  "experiments": {
    "new_ui_test": "variant_a",
    "pricing_test": "control"
  },
  
  // === 성능 정보 ===
  "pageLoadTime": 1200,                   // 페이지 로드 시간 (ms)
  "domReadyTime": 800,                    // DOM 준비 시간 (ms)
  "renderTime": 400,                      // 렌더링 시간 (ms)
}
```

### 이벤트별 상세 데이터
```javascript
{
  "eventData": {
    // === 도구 사용 이벤트 ===
    "inputSize": 1024,                    // 입력 데이터 크기 (bytes)
    "outputSize": 1365,                   // 출력 데이터 크기 (bytes)
    "processingTime": 45,                 // 처리 시간 (ms)
    "inputMethod": "paste",               // 입력 방법: paste|type|file|drag
    "outputFormat": "text",               // 출력 형태: text|file|copy
    "success": true,                      // 성공 여부
    "errorType": null,                    // 에러 타입: invalid_input|size_limit|network
    "errorMessage": null,                 // 에러 메시지
    
    // === 광고 이벤트 ===
    "adId": "ad_123456",                  // 광고 ID
    "adCampaignId": "camp_789",           // 캠페인 ID
    "adCreativeId": "creative_456",       // 크리에이티브 ID
    "adPosition": "banner_top",           // 광고 위치: banner_top|sidebar|popup|inline
    "adSize": "728x90",                   // 광고 사이즈
    "adFormat": "display",                // 광고 포맷: display|video|native|audio
    "bidPrice": 0.50,                     // 낙찰가 (USD)
    "advertiserId": "adv_123",            // 광고주 ID
    "adCategory": ["IAB19", "IAB3"],      // IAB 카테고리
    "viewability": 85,                    // 가시성 점수 (%)
    "viewDuration": 3500,                 // 노출 지속시간 (ms)
    
    // === 버튼/UI 인터랙션 ===
    "elementType": "button",              // 요소 타입
    "elementId": "convert-btn",           // 요소 ID
    "elementText": "변환하기",            // 요소 텍스트
    "elementPosition": "main_content",    // 요소 위치
    "clickX": 120,                        // 클릭 X 좌표
    "clickY": 80,                         // 클릭 Y 좌표
  }
}
```
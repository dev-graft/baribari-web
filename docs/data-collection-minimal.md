# 바리바리 최소 필수 데이터 수집 스키마

## MVP 단계 - 핵심 필수 필드만 수집

### 목표별 최소 필수 데이터

#### 1. OpenRTB AdEx 타겟팅 (필수 최소 7개)
```javascript
{
  "anonymousId": "anon_uuid_123",         // 사용자 식별
  "country": "KR",                        // 지역 타겟팅
  "deviceType": "desktop",                // 디바이스 타겟팅  
  "os": "macOS",                          // OS 타겟팅
  "browser": "Chrome",                    // 브라우저 타겟팅
  "language": "ko",                       // 언어 타겟팅
  "userAgent": "Mozilla/5.0..."           // OpenRTB 필수
}
```

#### 2. DAU/MAU 통계 (필수 최소 4개)
```javascript
{
  "anonymousId": "anon_uuid_123",         // 고유 사용자 식별
  "userId": 12345,                        // 로그인 사용자 (nullable)
  "timestamp": "2024-01-01T10:30:45Z",    // 활동 시점
  "eventType": "page_view"                // 활성 사용자 판단 기준
}
```

#### 3. A/B 테스트 (필수 최소 5개)
```javascript
{
  "anonymousId": "anon_uuid_123",         // 사용자 식별
  "eventType": "button_click",            // 측정 대상 이벤트
  "serviceArea": "tools",                 // 서비스 영역: tools|calendar|community|shop|profile
  "action": "convert",                    // 구체적 액션
  "experiments": {"ui_test": "variant_a"} // 실험 그룹
}
```

#### 4. 가입/탈퇴 추이 (필수 최소 3개)
```javascript
{
  "userId": 12345,                        // 사용자 ID
  "eventType": "user_signup",             // 가입/탈퇴 이벤트
  "timestamp": "2024-01-01T10:30:45Z"     // 발생 시점
}
```

#### 5. 광고 성과 (필수 최소 6개)
```javascript
{
  "anonymousId": "anon_uuid_123",         // 사용자 식별
  "eventType": "ad_impression",           // 노출/클릭 구분
  "adId": "ad_123456",                    // 광고 식별
  "adPosition": "banner_top",             // 광고 위치
  "timestamp": "2024-01-01T10:30:45Z",    // 발생 시점
  "serviceArea": "tools"                  // 서비스 컨텍스트: tools|calendar|community|shop
}
```

## 통합 최소 스키마 (중복 제거)

### Core Schema - 모든 이벤트 공통 (9개 필드)
```javascript
{
  // === 식별자 (3개) ===
  "eventId": "evt_1704067200_abc123",      // 중복 제거용 고유 ID
  "anonymousId": "anon_uuid_123",          // 익명 사용자 식별자
  "userId": null,                          // 로그인 사용자 ID (nullable)
  
  // === 시간 & 이벤트 (3개) ===
  "timestamp": "2024-01-01T10:30:45.123Z", // UTC 타임스탬프
  "eventType": "page_view",                // 이벤트 타입
  "eventCategory": "navigation",           // 이벤트 카테고리
  
  // === 컨텍스트 (3개) ===
  "pageUrl": "/tools/base64-converter",     // 현재 페이지
  "serviceArea": "tools",                  // 서비스 영역: tools|calendar|community|shop|profile
  "resourceId": "base64-converter"          // 리소스 ID: toolId|postId|eventId|productId (nullable)
}
```

### Extended Schema - OpenRTB & 타겟팅용 (추가 8개 필드)
```javascript
{
  // === 지역 & 언어 (2개) ===
  "country": "KR",                         // 국가 코드
  "language": "ko",                        // 주 언어
  
  // === 디바이스 정보 (4개) ===
  "deviceType": "desktop",                 // 디바이스 타입
  "os": "macOS",                          // 운영체제
  "browser": "Chrome",                    // 브라우저
  "userAgent": "Mozilla/5.0...",          // 전체 User-Agent
  
  // === 마케팅 (2개) ===
  "utmSource": "google",                  // 유입 소스 (nullable)
  "referrer": "https://google.com/search" // 레퍼러 (nullable)
}
```

### Event-Specific Data - 이벤트별 상세 정보
```javascript
{
  "eventData": {
    // === 도구 서비스 이벤트 ===
    "action": "encode",                   // 구체적 액션: encode|decode|convert|calculate|format
    "success": true,                      // 성공/실패
    "processingTime": 45,                 // 처리 시간 (ms)
    
    // === 캘린더 서비스 이벤트 ===
    "action": "create_event",             // 액션: create_event|update_event|delete_event|view_calendar
    "eventType": "meeting",               // 이벤트 타입: meeting|reminder|task|appointment
    "duration": 3600,                     // 지속시간 (초)
    
    // === 커뮤니티 서비스 이벤트 ===
    "action": "create_post",              // 액션: create_post|like_post|comment|share|follow
    "postType": "question",               // 게시글 타입: question|discussion|showcase|help
    "contentLength": 1200,                // 콘텐트 길이
    
    // === 쇼핑 서비스 이벤트 ===
    "action": "add_to_cart",              // 액션: view_product|add_to_cart|purchase|wishlist
    "productCategory": "theme",           // 상품 범주: theme|sticker|template|premium_tool
    "price": 9.99,                        // 가격 (USD)
    "currency": "USD",                    // 통화
    
    // === 광고 이벤트 ===
    "adId": "ad_123456",                  // 광고 ID
    "adPosition": "banner_top",           // 광고 위치
    "bidPrice": 0.50,                     // 입찰가 (nullable)
    
    // === A/B 테스트 ===
    "experiments": {                      // 실험 정보
      "ui_test": "variant_a",
      "pricing_test": "control"
    },
    
    // === 사용자 이벤트 ===
    "signupMethod": "email",              // 가입 방법: email|google|github|kakao
    "accountType": "free",                // 계정 유형: free|premium|enterprise
    "subscriptionTier": "basic"           // 구독 등급
  }
}
```

## 데이터베이스 테이블 구조 (MySQL)

### 메인 이벤트 테이블
```sql
CREATE TABLE user_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  
  -- 식별자
  event_id VARCHAR(50) UNIQUE NOT NULL,
  anonymous_id VARCHAR(36) NOT NULL,
  user_id INT NULL,
  
  -- 시간 & 이벤트
  timestamp TIMESTAMP(3) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_category VARCHAR(30),
  
  -- 컨텍스트
  page_url VARCHAR(500),
  service_area VARCHAR(20),
  resource_id VARCHAR(50),
  
  -- OpenRTB & 타겟팅
  country CHAR(2),
  language CHAR(2),
  device_type VARCHAR(20),
  os VARCHAR(30),
  browser VARCHAR(30),
  user_agent TEXT,
  utm_source VARCHAR(50),
  referrer VARCHAR(500),
  
  -- 상세 데이터 (JSON)
  event_data JSON,
  
  -- 인덱스
  INDEX idx_anonymous_id (anonymous_id),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_event_type (event_type),
  INDEX idx_country_device (country, device_type),
  INDEX idx_service_area (service_area),
  INDEX idx_resource_id (resource_id)
) ENGINE=InnoDB;
```

## 수집 우선순위

### Phase 1 (즉시 시작) - 8개 핵심 필드
- `eventId`, `anonymousId`, `userId`
- `timestamp`, `eventType`, `eventCategory` 
- `pageUrl`, `toolId`

### Phase 2 (1주 후) - 타겟팅 8개 추가
- `country`, `language`, `deviceType`, `os`
- `browser`, `userAgent`, `utmSource`, `referrer`

### Phase 3 (필요시) - 세부 분석용
- `eventData` 내 상세 정보
- 성능 정보, 실험 정보 등

## 이벤트 타입 목록

### 핵심 이벤트 (Phase 1)
- `page_view` - 페이지 조회
- `service_interaction_start` - 서비스 사용 시작 (도구, 캘린더, 커뮤니티 등)
- `service_interaction_complete` - 서비스 사용 완료
- `user_signup` - 사용자 가입
- `user_login` - 사용자 로그인

### 광고 이벤트 (Phase 2)
- `ad_impression` - 광고 노출
- `ad_click` - 광고 클릭
- `ad_viewable` - 광고 가시성

### 상호작용 이벤트 (Phase 3)
- `button_click` - 버튼 클릭
- `file_upload` - 파일 업로드
- `content_create` - 콘텐트 생성 (게시글, 이벤트, 상품 등)
- `content_share` - 콘텐트 공유
- `purchase` - 구매 완료
- `language_change` - 언어 변경

이 최소 스키마로도 모든 핵심 분석 목표를 달성할 수 있습니다.
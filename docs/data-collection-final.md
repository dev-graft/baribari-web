# 바리바리 데이터 수집 스키마 (최종)

## 수집 목적
- OpenRTB 광고 타겟팅
- DAU/MAU 통계  
- 유저 서비스 이용 통계 (기능별 사용량, 선호도 등)
- A/B 테스트
- 서비스 개선 분석

## 통합 스키마 (16개 필드)

### 기본 식별 정보 (4개)
```javascript
{
  "eventId": "evt_1704067200_abc123",      // 중복 제거용 고유 ID
  "anonymousId": "anon_uuid_123",          // 익명 사용자 식별자 (localStorage)
  "userId": 12345,                         // 로그인 사용자 ID (nullable)
  "timestamp": "2024-01-01T10:30:45Z"      // UTC 타임스탬프
}
```

### 이벤트 정보 (3개)
```javascript
{
  "eventType": "page_view",                // 이벤트 타입
  "serviceArea": "tools",                  // 서비스 영역: tools|calendar|community|shop|profile
  "action": "encode"                       // 구체적 액션 (nullable)
}
```

### 컨텍스트 정보 (3개)
```javascript
{
  "pageUrl": "/tools/base64-converter",     // 현재 페이지 URL
  "resourceId": "base64-converter",         // 리소스 ID: toolId|postId|productId (nullable)
  "referrer": "https://google.com/search"   // 유입 경로 (nullable)
}
```

### 타겟팅 정보 (6개) - OpenRTB 필수
```javascript
{
  "country": "KR",                         // 국가 코드 (IP 기반)
  "language": "ko",                        // 사용자 언어
  "deviceType": "desktop",                 // desktop|mobile|tablet
  "os": "macOS",                          // 운영체제
  "browser": "Chrome",                    // 브라우저
  "userAgent": "Mozilla/5.0..."           // User-Agent 전체
}
```

## 이벤트 타입별 예시

### 1. 페이지 조회
```javascript
{
  "eventId": "evt_001",
  "anonymousId": "anon_123", 
  "userId": null,
  "timestamp": "2024-01-01T10:30:45Z",
  
  "eventType": "page_view",
  "serviceArea": "tools", 
  "action": null,
  
  "pageUrl": "/tools/base64-converter",
  "resourceId": "base64-converter",
  "referrer": "https://google.com/search?q=base64",
  
  "country": "KR", "language": "ko", "deviceType": "desktop", 
  "os": "macOS", "browser": "Chrome", "userAgent": "Mozilla/5.0..."
}
```

### 2. 서비스 사용
```javascript
{
  "eventType": "service_use",
  "serviceArea": "tools",
  "action": "encode",                      // tools: encode|decode|convert|calculate
                                          // calendar: create_event|view_calendar
                                          // community: create_post|like|comment
                                          // shop: view_product|add_cart|purchase
  "resourceId": "base64-converter"
  // ... 나머지 필드 동일
}
```

### 3. 광고 이벤트  
```javascript
{
  "eventType": "ad_impression",           // ad_impression|ad_click
  "serviceArea": "tools",
  "action": "display",
  "resourceId": "ad_123456"               // 광고 ID
  // ... 나머지 필드 동일
}
```

### 4. 사용자 이벤트
```javascript
{
  "eventType": "user_signup",             // user_signup|user_login|user_logout
  "serviceArea": "profile", 
  "action": "email_signup",               // email_signup|google_oauth|github_oauth
  "resourceId": null
  // ... 나머지 필드 동일  
}
```

## MySQL 테이블 구조

```sql
CREATE TABLE events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  
  -- 기본 식별
  event_id VARCHAR(50) UNIQUE NOT NULL,
  anonymous_id VARCHAR(36) NOT NULL,
  user_id INT NULL,
  timestamp TIMESTAMP(3) NOT NULL,
  
  -- 이벤트 정보  
  event_type VARCHAR(30) NOT NULL,
  service_area VARCHAR(20) NOT NULL,
  action VARCHAR(50),
  
  -- 컨텍스트
  page_url VARCHAR(500),
  resource_id VARCHAR(50),
  referrer VARCHAR(500),
  
  -- 타겟팅
  country CHAR(2),
  language CHAR(5),
  device_type VARCHAR(10),
  os VARCHAR(20),
  browser VARCHAR(20),
  user_agent TEXT,
  
  -- 인덱스
  INDEX idx_anonymous_id (anonymous_id),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_event_type (event_type),
  INDEX idx_service_area (service_area),
  INDEX idx_country_device (country, device_type)
) ENGINE=InnoDB;
```

## 분석 쿼리 예시

### DAU/MAU
```sql
SELECT COUNT(DISTINCT anonymous_id) as DAU
FROM events 
WHERE DATE(timestamp) = CURDATE();
```

### 서비스별 사용량
```sql
SELECT service_area, COUNT(*) as usage_count
FROM events 
WHERE event_type = 'service_use'
GROUP BY service_area;
```

### 광고 성과
```sql
SELECT 
  COUNT(CASE WHEN event_type = 'ad_impression' THEN 1 END) as impressions,
  COUNT(CASE WHEN event_type = 'ad_click' THEN 1 END) as clicks
FROM events 
WHERE service_area = 'tools';
```

### OpenRTB 타겟팅 데이터
```sql
SELECT country, device_type, COUNT(*) as user_count
FROM events 
WHERE event_type = 'page_view'
GROUP BY country, device_type;
```

## 구현 순서

1. **Phase 1**: 기본 16개 필드 수집 시작
2. **Phase 2**: 분석 대시보드 구축  
3. **Phase 3**: OpenRTB 연동 및 광고 최적화

## 실제 데이터 수집 방법

### 프론트엔드 수집 라이브러리
```javascript
// analytics.js
class BaribariAnalytics {
  constructor() {
    this.anonymousId = this.getOrCreateAnonymousId();
    this.sessionId = this.generateSessionId();
    this.contextData = this.collectContextData();
  }
  
  // 자동 수집 - 페이지 로드 시
  getOrCreateAnonymousId() {
    let id = localStorage.getItem('baribari_anonymous_id');
    if (!id) {
      id = 'anon_' + crypto.randomUUID();
      localStorage.setItem('baribari_anonymous_id', id);
    }
    return id;
  }
  
  // 컨텍스트 정보 한번에 수집
  collectContextData() {
    return {
      country: this.getCountryFromIP(), // IP 기반 (백엔드에서 처리)
      language: navigator.language.split('-')[0],
      deviceType: this.getDeviceType(),
      os: this.getOS(),
      browser: this.getBrowser(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null
    };
  }
  
  // 이벤트 전송 - 사용자가 호출
  track(eventType, data = {}) {
    const event = {
      // 기본 식별
      eventId: this.generateEventId(),
      anonymousId: this.anonymousId,
      userId: this.getCurrentUserId(), // 로그인 상태에서만
      timestamp: new Date().toISOString(),
      
      // 이벤트 정보  
      eventType,
      serviceArea: data.serviceArea || this.getCurrentServiceArea(),
      action: data.action || null,
      
      // 컨텍스트
      pageUrl: window.location.pathname,
      resourceId: data.resourceId || null,
      
      // 자동 수집된 타겟팅 정보
      ...this.contextData
    };
    
    this.sendEvent(event);
  }
  
  async sendEvent(event) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      // 로컬 큐에 저장 후 재시도
      this.queueEvent(event);
    }
  }
}

// 전역 인스턴스
window.analytics = new BaribariAnalytics();
```

### 사용 예시

#### 1. 자동 페이지 추적
```javascript
// 페이지 로드 시 자동 호출
window.addEventListener('load', () => {
  analytics.track('page_view');
});

// SPA 라우팅 시
window.addEventListener('popstate', () => {
  analytics.track('page_view');
});
```

#### 2. 도구 사용 추적
```javascript
// Base64 변환 시작
analytics.track('service_use', {
  serviceArea: 'tools',
  action: 'encode_start',
  resourceId: 'base64-converter'
});

// 변환 완료
analytics.track('service_use', {
  serviceArea: 'tools', 
  action: 'encode_complete',
  resourceId: 'base64-converter'
});
```

#### 3. 커뮤니티 활동
```javascript
// 게시글 작성
analytics.track('service_use', {
  serviceArea: 'community',
  action: 'create_post',
  resourceId: 'post_12345'
});

// 좋아요 클릭
analytics.track('service_use', {
  serviceArea: 'community',
  action: 'like',
  resourceId: 'post_12345'
});
```

#### 4. 쇼핑 활동
```javascript
// 상품 조회
analytics.track('service_use', {
  serviceArea: 'shop',
  action: 'view_product',
  resourceId: 'theme_dark_001'
});

// 구매 완료
analytics.track('service_use', {
  serviceArea: 'shop',
  action: 'purchase_complete',
  resourceId: 'order_789'
});
```

### 백엔드 API 설계

#### POST /api/analytics/events
```javascript
// 요청 본문 검증
const eventSchema = {
  eventId: { type: 'string', required: true },
  anonymousId: { type: 'string', required: true },
  userId: { type: 'number', required: false },
  timestamp: { type: 'string', required: true },
  eventType: { type: 'string', required: true },
  serviceArea: { type: 'string', required: true },
  // ... 나머지 필드
};

app.post('/api/analytics/events', async (req, res) => {
  try {
    // 1. 요청 검증
    const event = validateEvent(req.body);
    
    // 2. IP 기반 국가 정보 추가 (프론트엔드에서 못 가져오는 정보)
    event.country = getCountryFromIP(req.ip);
    
    // 3. 중복 제거 (eventId 기반)
    if (await isEventExists(event.eventId)) {
      return res.status(200).json({ status: 'duplicate' });
    }
    
    // 4. 데이터베이스 저장
    await saveEvent(event);
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 배치 전송 최적화
```javascript
class BaribariAnalytics {
  constructor() {
    this.eventQueue = [];
    this.batchSize = 10;
    this.flushInterval = 5000; // 5초
    
    // 주기적 배치 전송
    setInterval(() => this.flushEvents(), this.flushInterval);
  }
  
  track(eventType, data) {
    const event = this.createEvent(eventType, data);
    this.eventQueue.push(event);
    
    // 큐가 가득 차면 즉시 전송
    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents();
    }
  }
  
  async flushEvents() {
    if (this.eventQueue.length === 0) return;
    
    const events = this.eventQueue.splice(0, this.batchSize);
    
    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      // 실패한 이벤트는 다시 큐에 추가
      this.eventQueue.unshift(...events);
    }
  }
}
```

## 개인정보보호 고려사항

```javascript
// 쿠키 동의 확인
class BaribariAnalytics {
  constructor() {
    this.consentGiven = this.checkConsent();
    if (!this.consentGiven) {
      this.showConsentBanner();
    }
  }
  
  track(eventType, data) {
    // 동의 없으면 수집하지 않음
    if (!this.consentGiven) return;
    
    // 개인정보 마스킹
    const sanitizedData = this.sanitizeData(data);
    // ... 이벤트 전송
  }
}
```

이 방식으로 프론트엔드에서는 간단하게 호출하면서도, 모든 필요한 정보를 자동으로 수집할 수 있습니다.
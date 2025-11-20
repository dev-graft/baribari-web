# 바리바리 서비스 확장별 이벤트 정의

## 서비스 영역별 이벤트 매핑

### 1. 도구 서비스 (Tools) - `serviceArea: "tools"`

#### 기본 이벤트
```javascript
{
  "eventType": "service_interaction_start",
  "serviceArea": "tools", 
  "resourceId": "base64-converter",
  "eventData": {
    "action": "encode", // encode|decode|convert|calculate|format|validate
    "inputMethod": "paste", // paste|type|file|drag
    "inputSize": 1024
  }
}
```

#### 지원 액션
- `encode`, `decode` - Base64, URL 인코딩/디코딩
- `convert` - 단위 변환, 통화 변환, 색상 변환
- `calculate` - 계산기, 해시 계산, 암호화
- `format` - JSON, XML, CSS 포맷팅
- `validate` - JSON, XML, 정규식 검증
- `generate` - UUID, 비밀번호, QR코드 생성

### 2. 캘린더 서비스 (Calendar) - `serviceArea: "calendar"`

#### 이벤트 관리
```javascript
{
  "eventType": "service_interaction_complete",
  "serviceArea": "calendar",
  "resourceId": "meeting_123",
  "eventData": {
    "action": "create_event", // create_event|update_event|delete_event|duplicate_event
    "eventType": "meeting", // meeting|reminder|task|appointment|deadline
    "duration": 3600, // 초
    "participants": 5,
    "isRecurring": true,
    "visibility": "public" // public|private|shared
  }
}
```

#### 캘린더 보기
```javascript
{
  "eventType": "page_view",
  "serviceArea": "calendar", 
  "eventData": {
    "viewType": "month", // month|week|day|agenda|year
    "dateRange": "2024-01",
    "eventsCount": 15
  }
}
```

### 3. 커뮤니티 서비스 (Community) - `serviceArea: "community"`

#### 게시글 관련
```javascript
{
  "eventType": "content_create",
  "serviceArea": "community",
  "resourceId": "post_789",
  "eventData": {
    "action": "create_post", // create_post|edit_post|delete_post
    "postType": "question", // question|discussion|showcase|help|announcement
    "category": "tools_help",
    "contentLength": 1200,
    "hasImages": true,
    "hasCodeBlock": false,
    "tags": ["base64", "converter", "help"]
  }
}
```

#### 사회적 상호작용
```javascript
{
  "eventType": "social_interaction",
  "serviceArea": "community",
  "resourceId": "post_789",
  "eventData": {
    "action": "like", // like|comment|share|follow|bookmark|report
    "targetType": "post", // post|comment|user
    "targetId": "post_789",
    "reactionType": "helpful" // like|love|helpful|insightful
  }
}
```

### 4. 쇼핑 서비스 (Shop) - `serviceArea: "shop"`

#### 상품 탐색
```javascript
{
  "eventType": "product_interaction",
  "serviceArea": "shop",
  "resourceId": "theme_premium_001",
  "eventData": {
    "action": "view_product", // view_product|add_to_cart|remove_from_cart|wishlist
    "productType": "theme", // theme|sticker|template|premium_tool|subscription
    "category": "dark_themes",
    "price": 9.99,
    "currency": "USD",
    "discount": 0.20 // 20% 할인
  }
}
```

#### 구매 프로세스
```javascript
{
  "eventType": "purchase",
  "serviceArea": "shop",
  "eventData": {
    "action": "complete_purchase",
    "orderId": "order_456",
    "totalAmount": 19.98,
    "itemCount": 2,
    "paymentMethod": "credit_card", // credit_card|paypal|crypto|gift_card
    "products": [
      {"id": "theme_001", "price": 9.99, "type": "theme"},
      {"id": "sticker_pack_005", "price": 9.99, "type": "sticker"}
    ]
  }
}
```

### 5. 프로필/계정 서비스 (Profile) - `serviceArea: "profile"`

#### 계정 관리
```javascript
{
  "eventType": "account_management",
  "serviceArea": "profile",
  "eventData": {
    "action": "update_profile", // update_profile|change_password|delete_account|export_data
    "changedFields": ["avatar", "bio", "preferences"],
    "privacyLevel": "public" // public|friends_only|private
  }
}
```

#### 구독 관리
```javascript
{
  "eventType": "subscription_change",
  "serviceArea": "profile",
  "eventData": {
    "action": "upgrade", // upgrade|downgrade|cancel|pause|renew
    "fromTier": "free",
    "toTier": "premium",
    "billingCycle": "monthly", // monthly|yearly
    "price": 9.99
  }
}
```

## 공통 메타 이벤트

### 검색 기능 (모든 서비스)
```javascript
{
  "eventType": "search",
  "serviceArea": "tools", // 검색이 일어난 서비스 영역
  "eventData": {
    "query": "base64 converter",
    "resultsCount": 15,
    "searchType": "keyword", // keyword|filter|advanced
    "selectedResultIndex": 3
  }
}
```

### 공유 기능 (모든 서비스)
```javascript
{
  "eventType": "content_share",
  "serviceArea": "tools",
  "resourceId": "base64-converter",
  "eventData": {
    "shareMethod": "copy_link", // copy_link|twitter|facebook|discord|email
    "shareTarget": "tool_result" // tool_result|post|event|product
  }
}
```

### 알림 관련
```javascript
{
  "eventType": "notification_interaction",
  "eventData": {
    "action": "click", // click|dismiss|mark_read|unsubscribe
    "notificationType": "community_reply", // community_reply|calendar_reminder|shop_promotion|system_update
    "sourceService": "community",
    "isDesktop": true // desktop notification vs in-app
  }
}
```

## 서비스별 핵심 KPI 이벤트

### 도구 서비스
- **사용량**: `service_interaction_complete` with `success: true`
- **인기 도구**: `resourceId` 기준 집계
- **변환 성공률**: `eventData.success` 비율

### 캘린더 서비스  
- **활성 사용자**: 이벤트 생성/수정 횟수
- **일정 참여도**: `participants` 평균값
- **반복 일정 활용**: `isRecurring: true` 비율

### 커뮤니티 서비스
- **참여도**: 게시글, 댓글, 좋아요 수
- **도움 품질**: `reactionType: "helpful"` 비율  
- **카테고리별 활동**: `category` 기준 분석

### 쇼핑 서비스
- **전환율**: 상품 조회 → 장바구니 → 구매
- **평균 주문액**: `totalAmount` 평균
- **인기 상품**: `productType` 및 `category` 분석

## 크로스 서비스 분석

### 사용자 여정 추적
```javascript
// 도구 사용 → 커뮤니티 질문 → 프리미엄 구독 패턴
[
  {"serviceArea": "tools", "eventType": "service_interaction_complete", "success": false},
  {"serviceArea": "community", "eventType": "content_create", "postType": "help"},  
  {"serviceArea": "profile", "eventType": "subscription_change", "action": "upgrade"}
]
```

### 서비스 간 연관성
- 도구 사용 실패 → 커뮤니티 도움 요청
- 커뮤니티 활동 → 프리미엄 테마 구매  
- 캘린더 사용 → 알림/리마인더 도구 활용
- 쇼핑몰 테마 적용 → 도구 사용량 증가

이 구조로 바리바리의 모든 서비스 확장을 추적하고 분석할 수 있습니다.
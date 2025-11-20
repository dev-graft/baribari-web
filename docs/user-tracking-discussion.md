# 사용자 활동 추적 및 데이터 수집 논의

## 질문 1: 데이터 수집 전략
**질문**: 도구 사용량 정보와 광고 타겟팅 데이터를 별도로 수집할지, 원천 데이터를 변환하는 형태가 좋은지?

**답변**: 원천 데이터 + 변환 방식을 권장
- Single Source of Truth 구조로 일관성 확보
- 유연성과 비용 효율성 제공
- 개인정보보호 요구사항에 따른 선별적 분리

## 질문 2: 일반적인 웹/앱 서비스 데이터 수집
**질문**: 회사들이 프로모션을 위해 어떤 정보를 수집하는지?

**답변**: 카테고리별 수집 데이터
1. **핵심 사용자 행동**: 페이지뷰, 클릭 이벤트, 사용자 플로우
2. **사용자 프로필링**: 기술적 정보, 지역, 관심사/선호도
3. **마케팅 활용**: 획득 채널, 리텐션 분석
4. **수익화**: 광고 타겟팅, 제품 개선

## 질문 3: 구체적인 이벤트 수집 목록
**질문**: 바리바리 프로젝트에 맞는 구체적인 수집 이벤트는?

**답변**: 6가지 핵심 이벤트 카테고리
1. **페이지/네비게이션 이벤트**: page_view, tool_page_enter
2. **도구 사용 이벤트**: tool_usage_start/complete/error
3. **사용자 인터랙션**: button_click, file_upload, language_change
4. **사용자 플로우**: tool_switch, session_start/end
5. **광고 관련**: ad_impression, ad_click
6. **성능/품질**: page_performance, user_satisfaction_signal

## 질문 4: 익명 사용자 추적 및 계정 연결
**질문**: 로그인 없이도 브라우저 식별 정보로 활동을 추적하고, 로그인 시 연결하는 방식이 가능한지?

**답변**: Anonymous User Tracking + User Identity Resolution
- 브라우저 식별자 생성 (UUID + localStorage, 브라우저 핑거프린팅)
- 익명 활동 수집 후 로그인 시 계정 연결
- Cross-Device Tracking 및 Probabilistic Matching 기술 활용
- 개인정보보호법 준수 필수

## 기술적 구현 예시

### 브라우저 식별자 생성
```javascript
const generateAnonymousId = () => {
  let anonymousId = localStorage.getItem('anonymous_user_id');
  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem('anonymous_user_id', anonymousId);
  }
  return anonymousId;
};
```

### 데이터 수집 구조
```javascript
{
  timestamp: "2024-01-01T10:00:00Z",
  anonymousId: "anon_abc123",
  fingerprint: "fp_xyz789",
  userId: null, // 로그인 전에는 null
  
  event: "tool_usage_complete",
  eventData: {
    toolId: "base64-converter",
    action: "encode"
  }
}
```

### 사용자 계정 연결
```sql
UPDATE user_events 
SET user_id = 'user_real123' 
WHERE anonymous_id = 'anon_abc123' 
  AND user_id IS NULL
  AND created_at > NOW() - INTERVAL '30 days';
```

## 개인정보보호 고려사항
- GDPR/개인정보보호법 준수
- 쿠키 동의 관리
- 데이터 보존 정책 (익명 데이터 30일 후 삭제)
- 옵트아웃 지원 (Do Not Track)

## 결론
원천 데이터 중심의 수집 전략과 익명 사용자 추적 + 계정 연결 방식을 조합하여, 법적 준수를 보장하면서도 효과적인 사용자 분석 및 광고 타겟팅이 가능한 시스템 구축이 권장됨.
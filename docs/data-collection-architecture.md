# 데이터 수집 및 저장 아키텍처 가이드

## 목적
- OpenRTB 광고 타겟팅
- DAU/MAU 통계
- 유저 서비스 이용 통계 (기능별 사용량, 선호도 등)
- A/B 테스트
- 서비스 개선 분석

---

## 1. 무료 방식 (Zero Cost Architecture)

### 기술 스택
- **수집**: 자체 API + 로그 파일
- **저장**: PostgreSQL + DuckDB + 로컬 파일시스템
- **분석**: DuckDB + Grafana (오픈소스)

### 아키텍처 구성도
```
[Client Apps] 
    ↓ (이벤트 API 호출)
[API Server (Node.js/Go)]
    ├─ [PostgreSQL] ← 실시간 통계 (최근 7일)
    ├─ [Log Files] ← 원시 이벤트 데이터
    └─ [DuckDB] ← 분석용 (배치 처리)
         ↓
[Grafana Dashboard] ← 시각화
```

### 데이터 플로우
1. **실시간 수집**: 클라이언트 → API 서버 → PostgreSQL (집계 데이터)
2. **원시 데이터**: API 서버 → 로그 파일 (JSON Lines 형태)
3. **배치 분석**: 매일 자정 크론 → 로그 파일 → DuckDB 변환
4. **장기 보관**: 월 단위로 Parquet 파일 압축 저장

### 구현 상세

#### API 서버 구조
```javascript
// 이벤트 수집 API
app.post('/api/events', async (req, res) => {
  const event = req.body;
  
  // 1. 실시간 통계 업데이트 (PostgreSQL)
  await updateRealtimeStats(event);
  
  // 2. 원시 데이터 로그 기록
  logger.info(JSON.stringify(event));
  
  res.status(200).send('OK');
});
```

#### PostgreSQL 테이블 설계
```sql
-- 일별 통계
CREATE TABLE daily_stats (
  date DATE,
  tool_id VARCHAR(50),
  event_type VARCHAR(20),
  count INTEGER,
  PRIMARY KEY (date, tool_id, event_type)
);

-- 실시간 사용자 세션
CREATE TABLE user_sessions (
  session_id UUID PRIMARY KEY,
  user_id VARCHAR(100),
  start_time TIMESTAMP,
  last_activity TIMESTAMP,
  events_count INTEGER
);
```

#### DuckDB 배치 처리
```python
# daily_etl.py
import duckdb
import json
from datetime import datetime, timedelta

def process_daily_logs():
    conn = duckdb.connect('analytics.duckdb')
    
    # 로그 파일에서 이벤트 읽기
    yesterday = datetime.now() - timedelta(days=1)
    log_file = f"logs/events-{yesterday.strftime('%Y%m%d')}.log"
    
    # DuckDB로 직접 JSON 로그 분석
    conn.execute(f"""
        CREATE OR REPLACE TABLE daily_events AS
        SELECT * FROM read_json_auto('{log_file}')
    """)
    
    # 집계 쿼리 실행
    conn.execute("""
        INSERT INTO tool_usage_stats 
        SELECT 
            date_trunc('day', timestamp) as date,
            tool_id,
            event_type,
            count(*) as count
        FROM daily_events 
        GROUP BY 1, 2, 3
    """)
```

### 장점
- **완전 무료** (서버 비용 제외)
- **데이터 소유권** 100% 확보
- **커스터마이징** 자유도 높음
- **마이그레이션** 언제든지 가능

### 단점
- **확장성** 제한 (대용량 트래픽 시 성능 한계)
- **실시간 분석** 기능 제한적
- **운영 부담** 직접 관리 필요

---

## 2. 저비용 방식 (Low-Cost Architecture)

### 기술 스택
- **수집**: Segment (무료 티어) + 자체 API
- **저장**: BigQuery + Redis
- **분석**: BigQuery + Metabase

### 아키텍처 구성도
```
[Client Apps]
    ├─ [Segment SDK] → [Segment] → [BigQuery]
    └─ [Custom API] → [Redis Cluster] → [BigQuery ETL]
                           ↓
                    [Metabase Dashboard]
```

### 데이터 플로우
1. **클라이언트 이벤트**: Segment SDK → Segment → BigQuery (무료 10,000 events/월)
2. **실시간 데이터**: 자체 API → Redis → 실시간 대시보드
3. **OpenRTB 데이터**: Redis (실시간 응답) + BigQuery (분석)
4. **배치 ETL**: Redis → BigQuery (매시간)

### 비용 구조
- **Segment**: 무료 10,000 이벤트/월, 초과 시 $0.001/이벤트
- **BigQuery**: 
  - 저장소: $0.02/GB/월
  - 쿼리: $5/TB (첫 1TB 무료)
- **Redis Cloud**: $7/월 (30MB) ~ $15/월 (100MB)

### 구현 상세

#### Segment 연동
```javascript
// 클라이언트 사이드
analytics.track('Tool Used', {
  tool_id: 'base64-converter',
  user_id: userId,
  session_id: sessionId,
  timestamp: new Date().toISOString()
});
```

#### Redis 실시간 처리
```javascript
// 실시간 카운터 (OpenRTB용)
const redis = require('redis');
const client = redis.createClient();

// 실시간 사용자 수 카운팅
async function trackActiveUser(userId) {
  const key = `active_users:${getCurrentMinute()}`;
  await client.sadd(key, userId);
  await client.expire(key, 3600); // 1시간 TTL
}

// A/B 테스트 그룹 할당
async function getTestGroup(userId) {
  const cached = await client.get(`test_group:${userId}`);
  if (cached) return cached;
  
  const group = Math.random() > 0.5 ? 'A' : 'B';
  await client.setex(`test_group:${userId}`, 86400, group);
  return group;
}
```

#### BigQuery 스키마
```sql
-- 이벤트 테이블 (Segment에서 자동 생성)
CREATE TABLE events (
  id STRING,
  user_id STRING,
  event_type STRING,
  properties JSON,
  timestamp TIMESTAMP,
  received_at TIMESTAMP
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id;

-- 집계 테이블 (매시간 ETL로 생성)
CREATE TABLE hourly_stats (
  hour TIMESTAMP,
  tool_id STRING,
  event_type STRING,
  unique_users INT64,
  total_events INT64
)
PARTITION BY DATE(hour);
```

#### ETL 파이프라인 (Cloud Functions)
```python
import redis
from google.cloud import bigquery

def redis_to_bigquery():
    r = redis.Redis(host='your-redis-host')
    client = bigquery.Client()
    
    # Redis에서 집계 데이터 조회
    current_hour = datetime.now().replace(minute=0, second=0)
    stats = r.hgetall(f"hourly_stats:{current_hour}")
    
    # BigQuery로 배치 삽입
    table = client.table('your_dataset.hourly_stats')
    rows = [
        {
            'hour': current_hour,
            'tool_id': key.decode(),
            'count': int(value.decode())
        }
        for key, value in stats.items()
    ]
    table.insert_rows(rows)
```

### 장점
- **확장성** 우수 (BigQuery는 페타바이트급 처리)
- **관리 부담** 적음 (매니지드 서비스)
- **실시간 성능** 좋음 (Redis)
- **비용 예측** 가능

### 단점
- **종속성** (클라우드 서비스 의존)
- **비용 상승** 가능성 (트래픽 증가 시)
- **데이터 이전** 복잡함

---

## 3. 선택 가이드

### 무료 방식을 선택하는 경우
- **초기 스타트업** 또는 사이드 프로젝트
- **월 이벤트 수 < 100만건**
- **실시간성 요구사항이 낮음**
- **개발 리소스 충분**

### 저비용 방식을 선택하는 경우
- **성장 중인 서비스** (월 100만~1000만 이벤트)
- **OpenRTB 등 실시간 응답 필요**
- **운영 리소스 부족**
- **월 $50~200 정도 비용 감당 가능**

### 마이그레이션 전략
1. **1단계**: 무료 방식으로 시작
2. **2단계**: 트래픽 증가 시 Redis 추가 (실시간성 확보)
3. **3단계**: BigQuery로 장기 분석 데이터 이관
4. **4단계**: Segment 도입으로 수집 자동화

---

## 4. 추천 구현 순서

### Phase 1: 기본 수집 체계 구축
1. PostgreSQL + 로그 파일 수집 시작
2. 기본 대시보드 구현 (Grafana)
3. DuckDB 배치 분석 파이프라인 구축

### Phase 2: 실시간성 강화
1. Redis 도입 (실시간 카운터, 세션 관리)
2. OpenRTB 응답 최적화
3. A/B 테스트 인프라 구축

### Phase 3: 확장성 확보
1. BigQuery ETL 파이프라인 구축
2. Segment 연동 (수집 자동화)
3. 고도화된 분석 쿼리 및 대시보드

이 구조로 시작하시면 비용을 최소화하면서도 필요에 따라 단계적으로 확장할 수 있습니다.
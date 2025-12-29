# HomeScope

실거래 데이터를 기반으로 지역별 평균 거래가, 증감률, 연식(신축.준신축/구축)별 가격 분포를 시각화한 부동산 통계 대시보드 입니다.



## 프로젝트 목적

- 대량의 부동산 실거래 데이터를 사람이 이해하기 쉬운 형태로 가공
- 지역별 가격 수준과 변화 흐름을 직관적으로 비교할 수 있는 UI 제공
- 단순 조회가 아닌 정렬 및 필터 기반 통계 UX 구현



## 주요 기능
- 지역별 평균 거래가 통계
- 전기 대비 가격 증감률 분석 (상승 / 하락 정렬)
- 연식 기준 통계 (신축 / 준신축 / 구축)
- 상위 / 하위 기준 정렬
- 차트 + 카드(or 테이블) 기반 통계 시각화
- 데이터 미존재 시 안내 메시지 처리



## 기술스택

### Backend
- Java 21
- Spring Boot
- Jpa
- Elasticsearch

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Nivo(Chart)

### Infra / Tools
- Docker
- Git / Github



## 시스템 구조
- 실거래 데이터를 용도에 따라 DB 및 Elasticsearch에 저장
- 통계 API에서 지역 / 기간 기준으로 집계
- 프론트엔드에서 정렬 및 필터 상태에 따라 시각화



## 핵심 구현 포인트

- 실거래 데이터 기반 지역 / 기간 단위 통계 집계 로직 구현
- 연식 기준(신축 / 준신축 / 구축)을 고려한 집계 구조 설계
- 평균가 및 증감률 계산을 위한 집계 쿼리 최적화
- 통계 결과를 프론트엔드 요구사항에 맞는 DTO로 가공하여 제공
- 데이터 미존재 구간에 대한 예외 처리 및 API 안정성 확보


## 실행 방법

### Backend (Docker 필수)
본 프로젝트는 Elasticsearch를 사용하며 로컬 개발 환경에서는 Docker 기반 실행을 전제로 합니다.

```bash
docker-compose up -d
```

컨테이너 실행 후 Spring Boot 애플리케이션 실행

### Frontend
npm install은 최초 실행 시 또는 의존성이 변경된 경우에 실행합니다.

```bash
npm install 
npm run dev
```


# [v1~v2]HomeScope 

실거래 데이터를 기반으로 지역별 평균 거래가, 증감률, 연식(신축.준신축/구축)별 가격 분포를 시각화한 부동산 통계 대시보드 입니다.
<table>
  <tr>
    <td><img width="100%" alt="Image" src="https://github.com/user-attachments/assets/c3afd7ef-b840-4e9f-90f4-60c9b4dda872" /></td>
    <td><img width="100%" alt="Image" src="https://github.com/user-attachments/assets/2272f602-6273-454b-a274-3f74176d1522" /></td>
  </tr>
  <tr>
    <td><img width="100%" alt="Image" src="https://github.com/user-attachments/assets/3a2c9167-0316-4c67-bae4-f351d5946a48" /></td>
    <td><img width="100%" alt="Image" src="https://github.com/user-attachments/assets/97f03854-2e08-4e50-b405-abb4e1f2b5c2" /></td>
  </tr>
</table>


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
- [고도화] 아파트 외 (빌라/연립, 단독/다가구, 오피스텔) 주거 유형 확장
- [고도화] 주거 유형별 데이터 수집 로직 통합
- [고도화] 관리자 페이지 숨김 처리 (Secret Key 기반 접근 제어)
- [고도화] 지역명으로 통계 검색
- [고도화] 화면 스크롤 버튼 (최상단, 최하단) 


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
- [고도화] ES 인덱스 구조 재설계를 통한 실거래 데이터 수집 파이프라인 통합
- [고도화] 프론트엔드 통계 페이지를 컴포넌트 단위로 분리하여 페이지 구조 간소화
- [고도화] 검색 기능을 프론트엔드에서 구현하여 서버 요청 최소화


## 실행 방법

### Backend (Docker 필수)
본 프로젝트는 Elasticsearch를 사용하며 로컬 개발 환경에서는 Docker 기반 실행을 전제로 합니다.

```bash
docker-compose up -d
```

컨테이너 실행 후 Spring Boot 애플리케이션 실행

### application-secret.yml

```
custom:
  api:
    key: my-api-key (공공데이터포탈 api key) ("" 안에 넣어야함)
  admin:
    key: my-secret-key (개인 임의의 secret key) ("" 안에 넣어야함)
```

### Frontend
npm install은 최초 실행 시 또는 의존성이 변경된 경우에 실행합니다.

```bash
npm install 
npm run dev
```

### .env.local
```
NEXT_PUBLIC_API_URL= Backend localhost 주소
NEXT_PUBLIC_ADMIN_KEY= Backend와 동일한 secret-key
```

# 자리 배치 프로그램 (Seat Assignment Program)

## 프로젝트 개요

이 프로젝트는 교실 내 학생 자리 배치를 위한 웹 기반 애플리케이션입니다. 교사가 학생 정보를 입력하고, 교실 레이아웃을 설정한 후, 학생들의 자리를 수동 또는 자동으로 배치할 수 있는 기능을 제공합니다.

## 주요 기능

### 1. 학생 정보 관리
- 학번과 이름을 개별적으로 입력하여 학생 추가
- 엑셀에서 복사한 데이터를 일괄 처리하여 다수의 학생 정보 한 번에 입력
- 학생 목록 조회, 삭제, 전체 초기화 기능

### 2. 교실 레이아웃 설정
- 교실 크기 조정 (열 수, 행 수 설정)
- 칠판, 창문, 복도 위치 표시
- 직사각형 형태의 좌석 배치

### 3. 자리 배치 기능
- 수동 배치 모드: 사용자가 직접 학생을 선택하여 좌석에 배치
- 제외 좌석 모드: 특정 좌석을 배치 대상에서 제외
- 자동 배치 기능: 
  - 다음 학생 배치: 남은 학생 중 한 명을 무작위로 선택하여 배치
  - 모든 학생 배치: 남은 모든 학생을 무작위로 배치
- 자리 초기화: 모든 좌석 배치 상태 초기화

### 4. 사용자 인터페이스
- 두 페이지 구조: 설정 페이지와 자리 배치 페이지
- 직관적인 UI로 쉬운 조작
- 반응형 디자인으로 다양한 화면 크기 지원

## 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript (순수 바닐라 JS)
- **서버**: Python의 http.server 모듈을 사용한 로컬 웹 서버
- **데이터 저장**: 클라이언트 측 메모리 (페이지 새로고침 시 데이터 소실)

## 파일 구조

```
/11_table/
  ├── index.html      # HTML 구조 및 UI 요소
  ├── styles.css      # 스타일 및 레이아웃 정의
  ├── script.js       # 자바스크립트 기능 구현
  └── README.md       # 프로젝트 문서
```

## 사용 방법

### 1. 설정 페이지

1. **학생 정보 입력**:
   - 학번과 이름을 개별적으로 입력하여 학생 추가
   - 또는 엑셀에서 복사한 데이터(탭으로 구분된 학번과 이름)를 텍스트 영역에 붙여넣고 '데이터 처리' 버튼 클릭

2. **레이아웃 설정**:
   - 열 수와 행 수를 입력하여 교실 크기 설정

3. '자리 배치 페이지로 이동' 버튼을 클릭하여 다음 단계로 진행

### 2. 자리 배치 페이지

1. **배치 모드 선택**:
   - 수동 배치: 학생을 선택하고 좌석을 클릭하여 배치
   - 제외 좌석: 배치에서 제외할 좌석 선택

2. **자동 배치 기능**:
   - '다음 학생 배치' 버튼: 남은 학생 중 한 명을 무작위로 배치
   - '모든 학생 배치' 버튼: 남은 모든 학생을 무작위로 배치

3. **자리 초기화**:
   - '자리 초기화' 버튼을 클릭하여 모든 좌석 배치 상태 초기화

4. '설정 페이지로 돌아가기' 버튼을 클릭하여 이전 단계로 돌아갈 수 있음

## 개발 세부사항

### HTML 구조
- 두 개의 페이지(설정 페이지, 자리 배치 페이지)로 구성
- 각 페이지는 div 요소로 구분되며 CSS 클래스를 통해 표시/숨김 처리
- 반응형 그리드 레이아웃 사용

### CSS 스타일링
- 모던하고 직관적인 UI 디자인
- Flexbox와 Grid 레이아웃 활용
- 호버 효과, 그림자 등을 통한 시각적 피드백
- 반응형 디자인으로 다양한 화면 크기 지원

### JavaScript 기능
- 객체 지향적 접근 방식으로 학생과 좌석 데이터 관리
- 이벤트 리스너를 통한 사용자 상호작용 처리
- 동적 DOM 조작을 통한 UI 업데이트
- 엑셀 데이터 파싱 및 처리 기능

## 향후 개선 사항

1. **데이터 저장 기능**:
   - 로컬 스토리지 또는 서버 측 데이터베이스를 활용한 데이터 영구 저장

2. **추가 레이아웃 옵션**:
   - 다양한 교실 형태 지원 (원형, U자형 등)
   - 커스텀 좌석 배치 기능

3. **고급 배치 알고리즘**:
   - 학생 특성(키, 시력 등)을 고려한 지능형 배치
   - 이전 배치 기록을 고려한 공정한 순환 배치

4. **내보내기 기능**:
   - PDF, 이미지, 엑셀 등 다양한 형식으로 자리 배치 결과 내보내기

5. **다국어 지원**:
   - 영어, 중국어 등 다양한 언어 지원

## 실행 방법

1. 프로젝트 폴더로 이동:
   ```
   cd c:\Programming\school_project\11_table
   ```

2. Python 웹 서버 실행:
   ```
   python -m http.server
   ```

3. 웹 브라우저에서 접속:
   ```
   http://localhost:8000
   ```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

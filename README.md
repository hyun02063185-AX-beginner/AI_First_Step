# 첫 출근 · AI 첫걸음 20강

주니어·사무직 입문자를 위한 인터랙티브 온보딩 강의 페이지.
"신입의 첫 출근" 은유로 사무실을 구역별로 도는 20강 커리큘럼 탐험 + 강의 슬라이드.

`Last_Lecture`("사유의 방", AX 실무 입문)를 복제해 만든 공용 엔진 사이트입니다.
엔진 공유 원칙은 `docs/엔진_경계.md` 참고.

## 흐름

```
시작 화면(밝은 오피스) ─[출근하기]→ 워프(차분한 페이드) ─→ 첫 출근 사무실
   └ 구역 4개(로비·미팅룸·내 책상·보안 게이트) ─클릭→ 카드 5장 부채꼴 전개
        └ 카드 선택 → 인터랙티브 강의 슬라이드 (키보드/버튼/스와이프)
```

게이미피케이션: 열람한 강의는 저장되어(HUD의 "발견한 강의 n/20", 탐험도 %) 구역·카드에 표시됨.
우상단 ↺ 버튼으로 초기화.

## 구역 4개

| 구역 | 사고 흐름 | accent |
|------|----------|--------|
| 🏢 로비 | 정체 — AI가 뭔데 | `#0E7490` 청록 |
| 💬 미팅룸 | 만남 — 처음 말 걸기 | `#7C3AED` 보라 |
| 💻 내 책상 | 책상 — 일에 얹기 | `#DB2777` 마젠타 |
| 🔐 보안 게이트 | 자세 — 현명하게 오래 | `#047857` 그린 |

## 파일 구조

```
AI_First_Step/
├─ index.html          # 씬 뼈대(시작·방·슬라이드) — 진단실 없음(practiceRoom:false)
├─ curriculum.md        # 20강 커리큘럼 문서(본진 상속본 — 갱신 예정)
├─ css/style.css        # 스킨 3종(office 기본·paper·neon)
├─ js/
│  ├─ site-config.js   # ★ 이 사이트를 정의하는 단 하나의 파일
│  ├─ data.js           # ★ 커리큘럼 + 슬라이드 데이터 (현재 20강 골격 상태)
│  ├─ room.js            # 사무실 · 구역 · 카드 부채꼴
│  ├─ slides.js          # 슬라이드 엔진
│  └─ main.js             # 씬 전환 · 배경 · 진행도
├─ netlify/functions/    # LMS(수강코드·통계·AI 브리핑) — 본진과 공용 Supabase
└─ assets/                # 이미지 넣는 곳
```

## 현재 상태 — 골격(v0.1-skeleton)

20강 전체가 cover(제목·부제) + closing(다음 강 티저) 2장 placeholder로만 채워져 있습니다.
본문 슬라이드는 후속 지시서에서 구역 단위로 채웁니다.

## site-config.js 로 사이트 정의

`js/site-config.js`에서 과정명·기본 스킨·연출 강도(fxLevel)·진단실 유무(practiceRoom) 등을
설정합니다. 본진 대비 새로 추가된 키(`rankTitles`·`completionTitle`·`completionTitleMastered`·
`skinGating`·`boxLabel`)는 엔진이 "값이 있으면 쓰고 없으면 본진 기본값"으로 읽으므로
본진 쪽 파일을 건드리지 않고도 안전하게 동작합니다.

## LMS — 본진과 공용 Supabase

이 사이트는 본진(Last_Lecture)과 **같은 Supabase 프로젝트**를 쓰되, 모든 이벤트에
`course: 'aifirst'`가 붙어 구분됩니다. 강사는 본진의 `#/admin` 대시보드에서
과정 필터로 이 사이트의 수강 현황만 따로 볼 수 있습니다.

`.env`는 저장소에 포함되지 않습니다 — 본진과 동일한 4개 값
(`SUPABASE_URL`·`SUPABASE_SERVICE_KEY`·`ADMIN_KEY`·`AI_API_KEY`)으로 새로 작성해야 합니다.

## PPT 내용 넣는 법

`js/data.js`에서 각 강의의 `slides` 배열을 채우면 된다.

지원 슬라이드 타입:

| type | 필드 | 용도 |
|------|------|------|
| `cover` | kicker, title, subtitle | 표지 (title은 `\n`으로 줄바꿈) |
| `big` | word, sub | 대형 키워드 1개 |
| `bullets` | title, subtitle, items[] | 소제목 + 항목 리스트 |
| `quote` | text, by | 인용/한마디 |
| `split` | title, left[], right[] | 좌우 비교 (각 배열 첫 항목=제목) |
| `image` | title, src, caption | 이미지 (`assets/`에 넣고 `src:"assets/파일.png"`) |
| `closing` | title, teaser | 마무리 + 다음 강 티저 |

## 실행

```bash
# 프로젝트 폴더에서 (LMS 함수까지 함께 띄우려면 netlify dev 권장)
npx netlify-cli dev --no-open --offline
```

정적 페이지만 확인할 땐 `python -m http.server 8000`도 가능하지만, 수강코드·통계·AI 브리핑
같은 LMS 기능은 `netlify/functions`가 떠 있어야 동작합니다.

## 배포

로컬 `git init`만 되어 있고 원격 저장소는 아직 연결되지 않았습니다.
GitHub 등에 연결할 때는 본진(`Last_Lecture`)과 별도의 저장소로 관리하세요.

## 조작

- **→ / Space / 클릭**: 다음 슬라이드  ·  **←**: 이전  ·  **Esc**: 방으로  ·  **Home/End**: 처음/끝
- 모바일: 좌우 스와이프

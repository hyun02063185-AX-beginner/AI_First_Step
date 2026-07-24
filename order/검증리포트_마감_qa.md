# qa-runner 보고 — AI_First_Step 마일스톤 마감 최종 회귀 (netlify dev, 로컬)

⚠ 시각 검증 미수행 — 사용자 육안 확인 필요 (`computer{action:"screenshot"}`가 이번 세션에서 "Browser pane is not displayed" 타임아웃으로 계속 실패. `computer` 도구의 좌표/ref 클릭도 이 환경에서 신뢰할 수 없음이 확인됨 — 아래 항목 다수는 DOM/JS 직접 조작(`javascript_tool`, `.click()`)으로 대체 검증했습니다. 375/768/1440px 레이아웃의 실제 시각적 정합성은 사용자가 직접 눈으로 확인 필요.)

| 항목 | 결과 | 비고/재현 절차 |
|---|---|---|
| npm test | ✅ | 149/149 통과 (2회 재실행 모두 동일, content-lint/aggregate/functions-contract 전부 pass) |
| 시각 검증(375/768/1440) | ⚠ 미수행 | `computer{action:"screenshot"}` 타임아웃("Browser pane is not displayed"). 대체로 각 뷰포트에서 `document.body.scrollWidth`/`innerWidth` 측정(아래 375px 행) — 이는 보조 증거일 뿐 배치 확인을 대신하지 못함 |
| 렌더(신규+표본 강의) | ✅ | 01/09/16/20강을 기본판·owner·student variant로 `App.resolveSlides()` 직접 호출해 확인. 01강 이미지 슬라이드(`diagram-daily-ai.svg`) `complete:true`. `#/lecture/1/3` 실제 라우팅 후 `get_page_text`로 데이터 일치 확인 |
| 티저 체인 | ✅ | 20강 전체 + owner/student variant 각각 스크립트로 검증 — `closing.teaser`가 항상 다음 강 제목/번호를 포함(끊김 0건). 20강 teaser는 AX 과정 예고로 정상 종결 |
| 이어보기 | ✅ | `#/lecture/1/3`, `#/lecture/5/6` 방문 후 `#/box/0` 카드 목록에 "▶ 이어보기 4/13", "▶ 이어보기 7/12" 등 정상 표시. TOC 목록에도 동일 반영 |
| 핵심 훑기 | ✅ | `#toc-btn` → `#toc-core` 토글 후 `#toc-list`에 big/quote/closing 문구(예: "AI를 만든 건 천재의 규칙이 아니라…")가 강의별로 펼쳐짐 확인 |
| 스킨 전수 | ✅ | `SITE_CONFIG.availableSkins` = office/paper/neon/sunset 4종 전부 `data-skin` 전환, 이미지 슬라이드 기준 각 전환 후 `img.complete:true` 유지, 콘솔 에러 0 |
| 375px | ✅ | `document.body.scrollWidth(375) === window.innerWidth(375)` → overflow 없음. 768px·1440px도 동일(스크롤 폭=뷰포트 폭) — 단 이는 수치 측정이며 시각 배치 확인은 아님(위 경고 참고) |
| 콘솔 0 | ✅ | 인트로→입장→강의 슬라이드→연습 책상 3존→스킨 전환→히든코드 5종→`?join=`→`#/admin`→`#/reset` 전 과정에서 `read_console_messages` 0건, netlify dev 서버 로그도 에러 0건 |
| 텔레메트리 | ✅ | `QARUN0724` 반코드를 `/.netlify/functions/codes`로 발급(course=aifirst) → `/.netlify/functions/track`에 `QARUN0724-테스트` 식별자로 `session_start` 이벤트 전송(204) → Supabase REST로 `events` 테이블에 1건 삽입 확인(id 103) → 이벤트+반코드 모두 DELETE → 재조회 0건 재확인 완료 |
| variant 표본 | ✅ | `?variant=owner`, `?variant=student` 각각 01/09/16/20강에서 `window.__persona` 정상 반영, `slidesVariants` 오버라이드가 실제로 합성됨 확인(예: 01강 슬라이드6 타이틀이 기본판/owner/student 각각 다르게 렌더) |
| ?join= | ✅ | `?join=테스트반` 접속 시 코드 레이어 자동 오픈(`hidden:false`) + `#scode-code-input` 값 `"테스트반"` 프리필 확인. **참고**: 지시서 표현은 `테스트반-`(하이픈 포함)이나 실제 동작은 하이픈 없이 `테스트반`만 채움 — `applyJoinLink()` 소스 구조상 원래부터 하이픈을 붙이지 않는 기존 설계이며, 과거 검증리포트(`order/검증리포트_최사장_완결_qa.md` 등)에도 동일하게 기록된 기존 동작이라 이번 회귀는 아님 |
| #/admin | ✅ | `#/admin` 접근 시 "강사 전용 / 첫 출근 · 대시보드" + `type="password"` 접속 키 입력란 + 입장 버튼 노출. 로그인 시도는 하지 않음 |
| 히든코드(추가 확인) | ✅ | `무대뒤.스킨`(스킨 전체 해금 플래그 set) / `무대뒤.판.자영업`(persona=owner로 전환, reload 반영) / `무대뒤.판.기본`(default 복귀) / `무대뒤.초기화`(confirm 승인 시 `#/reset`으로 이동, localStorage 전부 초기화: progress/desk_stamps/skin_unlock 모두 빈 값) 모두 🎫 코드칸 제출로 정상 동작 |
| 연습 책상 3존 | ✅ | ①미션 스탬프판: `data-stamp="1"` 버튼 클릭 → `desk_stamps=[1]`, 헤더 "미션 1/20", "완료 ✓" 표시. ②프롬프트 조립대: "메일 다듬기(11강)" 프리셋 클릭 → 상황/대상/원하는 모양 자동 채움 + 완성 프롬프트 조립 확인, "내 키트에 저장" → `desk_kit.prompts`에 반영. ③나의 시작 키트: 저장된 프롬프트·미션 진행(1/20) 카드에 정상 반영 |
| 키 비노출 | ✅ | 본 보고서 어디에도 `.env`의 `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`/`ADMIN_KEY`/`AI_API_KEY` 원문 값 없음(모두 node 스크립트 내부에서만 사용, 출력하지 않음) |

## 특이사항 (❌ 아님, 참고용)

1. **컴퓨터 클릭/스크린샷 도구 신뢰 불가**: 이번 세션에서 `computer{action:"left_click", ref:...}`가 눈에 보이는 반응 없이 무시되는 사례가 다수 확인됨(예: `#toc-core`/연습 책상 존 탭 클릭이 ref 좌표 클릭으로는 반영 안 됨, 동일 요소를 JS `.click()`으로 실행하면 정상 동작). Browser pane 컴포지팅 불가 상태와 연관된 것으로 보이며, 앱 코드의 버그가 아니라 **이번 세션 환경 제약**으로 판단됨. 다음 회귀에서 Browser pane이 정상 표시되면 재확인 권장.
2. **`?join=` 프리필 하이픈 불일치**: 위 표에 기재한 대로 지시서 문구(`테스트반-`)와 실제 동작(`테스트반`)이 다르나, 이는 기존부터의 설계이며 과거 QA 리포트에도 동일하게 기록된 사항 — 이번 마감 작업의 회귀는 아님.

## 결론

전체 20강 렌더·티저 체인·이어보기·핵심 훑기·스킨 4종·375px 오버플로·콘솔 0·텔레메트리 insert/cleanup·variant(owner/student)·`?join=`·`#/admin`·히든코드 5종·연습 책상 3존·npm test 149/149 — **❌ 항목 없음**. 유일한 미비점은 시각 검증(스크린샷)이 이번 세션 환경 제약으로 수행되지 못한 것이며, 이는 위에 명시한 대로 사용자 육안 확인이 필요합니다.

**참고 파일 경로**
- 저장소: `C:\Users\hyun0\AI_First_Step`
- 테스트: `C:\Users\hyun0\AI_First_Step\tests\content-lint.test.js`, `aggregate.test.js`, `functions-contract.test.js`
- 데이터: `C:\Users\hyun0\AI_First_Step\js\data.js`
- 엔진: `C:\Users\hyun0\AI_First_Step\js\main.js`, `js\telemetry.js`, `js\desk.js`
- 함수: `C:\Users\hyun0\AI_First_Step\netlify\functions\track.js`, `codes.js`
- 설정: `C:\Users\hyun0\AI_First_Step\js\site-config.js`, `.claude\launch.json`

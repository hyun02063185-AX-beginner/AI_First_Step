# qa-runner 보고 — AI_First_Step (netlify dev, localhost:8899)

> `order/에이전트체계_구축_지시서.md` §C "첫 가동 검증" 산출물. qa-runner 서브에이전트 첫 가동.
> **보고서만 — 발견된 버그 없음(전 항목 통과), 수정 지시 불필요.**

---

| 항목 | 결과 | 비고/재현 절차 |
|---|---|---|
| npm test | (해당없음) | 저장소에 `package.json` 자체가 없음 — 테스트 하네스 미구축. 확인만 하고 건너뜀 |
| 렌더 | ✅ | 01강(로비, `#/lecture/1/0`) 13슬라이드, 08강(미팅룸, `#/lecture/8/2`) 12슬라이드, 11강(내 책상, `#/lecture/11/0`) 2슬라이드(placeholder, "1/2" 정상) 모두 `get_page_text` 결과가 `js/data.js` 원문과 일치. 08강 도식(`assets/diagram-dialogue-loop.svg`) `naturalWidth:267`로 정상 로드 |
| 티저 체인 | ✅ | `js/data.js` 전체(01~20강) closing.teaser 직접 대조 — 01→02→…→05, 로비→미팅룸(05→06), 06→07→08→09→10, 미팅룸→내 책상(10→11), 11→12→13→14→15, 내 책상→보안 게이트(15→16), 16→17→18→19→20까지 끊김 없음. 08·11강 렌더 텍스트로 2차 교차 확인 |
| 이어보기 | ✅ | `#/lecture/1/5` 진입 후 이탈 → `#/box/0`에서 01강 카드에 `card__resume` DOM 요소로 "▶ 이어보기 6/13" 확인(조건부 렌더 요소라 신뢰도 높음) |
| 핵심 훑기 | ✅ | `#toc-btn` → `#toc-core` 클릭 후 `#toc-list`에 big/quote/closing 문구 정상 출력("오늘 아침, 이미 세 번쯤…", "이미 곁에 있었다" 등) |
| 스킨 전수 | ✅ | `SITE_CONFIG.availableSkins = ["office","paper","neon"]` 3종 전부 `data-skin` 전환, 이미지 슬라이드(01강) 기준 각 전환 후 콘솔 에러 0·이미지 `complete:true` 유지. 종료 후 `office`로 원복 |
| 375px | ✅ | mobile 프리셋(375×812) — 이미지 슬라이드(01강), split 슬라이드(08강), `#/box/0` 목록 3곳 모두 `document.body.scrollWidth(375) > window.innerWidth(375)` = false |
| 콘솔 0 | ✅ | 세션 전 구간(렌더·스킨 전환·리사이즈·variant·join·admin) `read_console_messages` 전부 빈 배열 |
| 텔레메트리 | ✅ | `.env`에 4개 키 모두 존재 확인(값은 미기재) → `/.netlify/functions/track`에 `code:"QARUN-20260722", event_type:"session_start", course:"aifirst"` POST(204) → Supabase REST로 삽입 확인(`id:83` 1건) → DELETE(204) → 재조회 결과 `[]`(0건) 재확인 완료 |
| variant 표본 | ✅ | `?variant=personal#/lecture/8/0`: `window.__variantPersonal=true`, HUD `.hud__vp`="P", `slidesPersonal` 미존재 강이라 기본 슬라이드로 정상 폴백(콘솔 에러 없음). `?variant=student#/lecture/1/0`: `window.__persona="student"`, HUD 뱃지="S"(title="페르소나: 대학생") 정상 |
| ?join= | ✅ | `?join=테스트반` 접속 시 `#scode-input.value === "테스트반-"`, 코드 레이어 `hidden:false`(자동 오픈) 확인. 실제 코드 등록/제출은 하지 않음 |
| #/admin | ✅ | `#/admin` 접근 시 `type="password" placeholder="접속 키"` 입력창 노출 확인. 로그인 시도는 하지 않음 |
| 키 비노출 | ✅ | 본 보고서 및 실행 과정에서 `.env` 값(SUPABASE_URL·SUPABASE_SERVICE_KEY·ADMIN_KEY·AI_API_KEY)을 원문으로 출력한 적 없음(존재 여부만 `grep -c`로 확인, curl은 셸 변수로만 사용) — 자체 재확인 완료 |

## 참고(❌ 아님, 정보성)
- 서버 기동 중(`preview_start` 직후 status "starting" 구간)에 자동 재시도 요청 4건이 `ERR_CONNECTION_REFUSED`로 실패한 기록이 네트워크 로그에 남아있음 — `preview_list`가 "running"으로 바뀐 이후 요청은 전부 200/304로 정상, 앱 결함 아님.
- `get_page_text`는 `opacity:0`으로 CSS 숨김 처리된 요소(`.card__seen`)의 텍스트도 포함해 반환함(예: 미열람 강의에서도 "✓ 열람함" 문구가 텍스트 추출에 나타남) — `computedStyle.opacity` 직접 확인으로 실제로는 숨김 상태임을 검증함. 이어보기 판정은 조건부 렌더 요소(`card__resume`)로 별도 검증해 이 이슈의 영향을 받지 않음.

## 멈추는 곳
전 항목 ✅로 마감. `preview_stop`으로 서버 정리 완료. 추가 수정 지시 없음 — ❌ 항목 없음.

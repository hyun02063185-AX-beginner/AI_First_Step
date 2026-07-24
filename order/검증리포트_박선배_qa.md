# qa-runner 보고 — AI_First_Step (박선배 완결 지시서 라운드)

⚠ 시각 검증 미수행 — 사용자 육안 확인 필요 (Browser pane 미표시로 `computer{action:"screenshot"}`가 5초 타임아웃, 반복 확인됨. 아래 DOM/JS 기하 확인으로 보조 검증만 수행함 — 이를 근거로 "통과"로 판정하지 않음.)

| 항목 | 결과 | 비고/재현 절차 |
|---|---|---|
| npm test | ✅ | 149 tests / 149 pass / 0 fail (content-lint, aggregate, functions-contract 전부 통과) |
| 시각 검증(375/768/1440) | ⚠️ 미수행 | `computer{action:"screenshot"}` → "Browser pane is not displayed, so the page is not compositing frames." 타임아웃. 대체로 `getBoundingClientRect`/`getComputedStyle`/`scrollWidth` 확인은 수행(아래 375px 항목 참고)했으나 이는 보조 증거일 뿐, 실제 레이아웃 확인은 사용자 육안 확인 필요 |
| 렌더(신규+표본 강의) | ✅ | `?variant=student` 01/06/09/16/20강, `?variant=owner` 09/12/16강을 `get_page_text`로 확인 — `js/data.js` 텍스트와 일치. 기본판(무variant) 09·16·20강도 대조해 회귀 없음 확인 |
| 티저 체인 | ✅ | `js/data.js`의 closing.teaser 20개 전수 grep 확인 — 01→02…19→20, 구역 경계(05→06, 10→11, 15→16) 모두 정확히 다음 강/구역 제목을 가리킴. 끊김 없음 |
| 이어보기 | ✅ | `#/lecture/3/4`(0-based, 5번째 슬라이드)로 진입 후 이탈 → `#toc-btn`으로 목록 열람 시 `<span class="toc__resume">▶ 5/13</span>` 정상 표시 |
| 핵심 훑기 | ✅ | `#toc-btn` → `#toc-core` 클릭 → `#toc-list`에 `toc__lines`로 big/quote/closing 문구 정상 노출 |
| 스킨 전수 | ✅ | office/paper/neon/sunset 4종 전환, 각 전환 시 콘솔 에러 0건, 이미지(svg diagram) 네트워크 요청 전부 200 OK |
| 375px | ✅ | mobile 프리셋(375×812)에서 `document.body.scrollWidth`(375) === `window.innerWidth`(375), overflow 없음 |
| 콘솔 0 | ✅ | 세션 전 과정(렌더·variant 전환·스킨 전환·히든코드·admin 진입 등)에서 `read_console_messages` 결과 항상 "No console logs" |
| 텔레메트리 | ✅ | 테스트 반코드 발급 → session_start 이벤트 전송(204) → Supabase 삽입 확인 → 정리(삭제)까지 전 과정 완료, 잔존물 없음 |
| variant 표본 | ✅ | `?variant=student`(01/06/09/16/20강), `?variant=owner`(09/12/16강), `?variant=personal`(7강, HUD "P" 뱃지) 모두 정상 렌더·콘솔 에러 없음 |
| ?join= | ✅ | `?join=테스트반` 접속 시 코드 레이어 자동 오픈 + 코드칸 프리필 + 이름칸 자동 포커스 확인(반코드/이름 분리 구조 반영, 설계상 정상) |
| #/admin | ✅ | 게이트 화면만 노출, 로그인 진행 없음 |
| 키 비노출 | ✅ | 실제 키 값 어디에도 echo되지 않음 재확인 |

## 발견 사항 — 16강 student 정리+과제 item[2] "회사 규칙" 잔존 (판단 필요, 확정된 버그 아님)

`js/data.js` 16강 `slidesVariants.student[11]`("한 장 정리 + 오늘의 과제")의 3번째 항목이 기본판 문구
`'회사 규칙이 개인 판단보다 먼저'`를 그대로 유지하고 있음(같은 슬라이드의 owner는 A-2 지시대로
`'가게의 규칙은 사장님이 정한다...'`로 전면 교체됨). qa-runner와 persona-reviewer(박선배 검증) 양쪽에서
독립적으로 발견.

**지시서 원문 확인 결과**: 이는 구현 누락이 아니라 지시서 규정 그대로임 —
- Part B 일반 형식(59행): "사례·생각해보기 전체 교체 + **과제 줄 교체**"(정리+과제 슬라이드는 📝 과제
  줄만 바꾸는 게 기본 형식).
- A-2(20행)는 "16강 정리+과제 — **owner** 전면 오버라이드"라고 명시 — student는 이 예외 대상이 아님.

다만 line 5의 대원칙 "회사 용어 금지"와는 결이 어긋난다 — 지시서 안에 두 규칙(일반 형식 vs 용어 금지
대원칙)이 16강 한 곳에서 충돌하는 셈이다. 내용상 심각한 위화감은 아니고(정리 슬라이드 한 줄), 임의로
어느 한쪽을 택해 고치기보다 판단을 사용자에게 넘긴다 — 필요시 item[2]를 owner처럼 학생 맥락으로
바꾸는 추가 오버라이드 한 줄만 등록하면 해소된다.

## 기타 참고
- 로컬 netlify dev 서버(포트 8001)를 재사용, 종료 후 별도 조치 없음.
- 이번 QA에서는 어떤 파일도 수정하지 않음(읽기 전용 도구만 사용).

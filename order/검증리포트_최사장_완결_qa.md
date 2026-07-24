# qa-runner 보고 — AI_First_Step (최사장 완결 지시서 라운드)

⚠ 시각 검증 미수행 — 사용자 육안 확인 필요 (스크린샷 캡처가 세션 내내 타임아웃됨: "Screenshot timed out... the Browser pane is not displayed". 375/768/1440px 3개 뷰포트 모두 시도했으나 캡처 자체가 불가능했음. 아래 결과는 DOM/콘솔/네트워크 기반 보조 검증일 뿐, 배치·겹침 등 시각적 회귀는 확인하지 못했다.)

추가로 알려드릴 환경 이슈: 이번 세션에서 Browser 패널이 실제로 디스플레이되지 않는 상태가 스크린샷뿐 아니라 `computer` 툴의 좌표/ref 클릭 신뢰성에도 간헐적으로 영향을 준 것으로 보인다(`window.innerWidth`가 일시적으로 0으로 관측된 사례 있음, `#toc-btn`·`#toc-core` 버튼은 `computer` ref 클릭이 반응하지 않다가 `element.click()` 직접 호출로는 정상 동작 확인됨). 대부분의 클릭(스플래시 진입, 다이얼로그, 프리셋, 스탬프, 히든코드 등록)은 `computer` 클릭으로 정상 동작했으나, 일부(TOC 토글)는 `.click()` 우회로만 확인했다는 점을 투명하게 밝힌다 — 이는 앱 버그가 아니라 이 세션의 Browser 패널 렌더링 문제로 판단된다.

| 항목 | 결과 | 비고/재현 절차 |
|---|---|---|
| npm test | ✅ | 149/149 통과 (fail 0, cancelled 0) |
| 시각 검증(375/768/1440) | ⚠ 미수행 | `computer{action:"screenshot"}` 3회 시도 모두 "Screenshot timed out... Browser pane is not displayed"로 실패. 대체 근거(아래 항목들)는 DOM/콘솔 기반 보조 증거일 뿐 시각 통과 판정 아님 |
| 렌더(신규+표본 강의) | ✅ | `?variant=owner`로 06·11·17·20강 확인 — `js/data.js`의 `slidesVariants.owner` 문구와 렌더 텍스트 완전 일치. 기본판·student판도 무변경(폴백 정상) — 회귀 없음 |
| 티저 체인 | ✅ | 06→"다음 강: 질문 잘하는 법", 11→"다음 강: 요약의 마법", 17→"다음 강: AI 괴담과 진실", 20은 closing(마지막)으로 정상 종료 |
| 이어보기 | ✅ | 06강 4/12에서 이탈 후 `#/box/1` 카드 목록에 "▶ 이어보기 4/12" 표시 확인 |
| 핵심 훑기 | ✅ | `#toc-btn`(전체 목차) 오픈 후 `#toc-core`(⚡ 핵심 훑기) 토글 시 `#toc` 리스트에 big/quote/closing 문구 정상 표시 — 단, `computer` ref 클릭이 반응하지 않아 `element.click()`으로 우회 확인(위 환경 이슈 참고) |
| 스킨 전수 | ✅ | `office/paper/neon/sunset` 4종 전부 `data-skin` 전환, 콘솔 에러 0건 |
| 375px | ✅ | `/#/lecture/1`, `?variant=owner#/desk`(zone① 20개 카드 + zone② owner 프리셋 채움 상태 포함) 모두 `scrollWidth(375) === innerWidth(375)`, overflow 없음 |
| 콘솔 0 | ✅ | 세션 전체(렌더·스킨전환·히든코드·리셋 등)에서 `read_console_messages` 결과 항상 "No console logs" |
| 텔레메트리 | ✅ | 테스트 반코드 `QARUN0724`를 `codes` 함수로 발급 → 앱 UI(연습책상 01강 스탬프 클릭)로 `track` 함수에 실제 이벤트 전송(204) → REST로 `events` 테이블 삽입 확인 → DELETE로 이벤트·반코드 모두 정리 → 재조회 0건 재확인 |
| variant 표본 | ✅ | owner: HUD "페르소나: 자영업" 배지, 01~20강 다수 표본 렌더 정상. student: HUD "S" 배지, 06강 렌더·콘솔 정상(회귀 없음) |
| ?join= | ✅ | `?join=테스트반` 접속 시 🎫 코드 레이어 자동 오픈, `#scode-code-input`에 "테스트반" 프리필, 이름칸 포커스 이동 확인 |
| #/admin | ✅ | "강사 전용" 화면 + "접속 키"(password) 입력란 노출, 로그인은 시도하지 않음 |
| 키 비노출 | ✅ | 본 보고서 어디에도 실제 키 값 없음 |

## 히든코드 3종 + 일반 수강코드 (지시서 특정 확인 항목)

- `무대뒤.판.자영업` 입력 → 등록 → 새로고침 후 `window.__persona === "owner"`, `localStorage.ax_cheat_persona === "owner"` 확인 ✅
- `무대뒤.판.기본` 입력 → 등록 → 새로고침 후 `persona === "default"`, cheat 플래그 `null` 확인 ✅
- `무대뒤.목록` 입력 시 패널에 `무대뒤.판.자영업 / 무대뒤.판.대학생 / 무대뒤.판.기본` 3개 신규 명령 정상 노출 ✅
- 일반 수강 코드(`QA반` + `테스터`) 등록 → `localStorage.ax_student_code === "QA반-테스터"` 정상 저장, 회귀 없음 ✅
- `#/reset` 시 `ax_cheat_persona`도 함께 `null`로 초기화 확인 ✅

## 참고 — 버그 아님 판단이 애매했던 관찰 사항 (수정 지시 아님, 판단 재확인용)

1. `?join=테스트반` 프리필 값이 "테스트반-"이 아니라 "테스트반"(하이픈 없음)인 점 — 지시서 표현과 소스 동작이 다르지만, 소스(`applyJoinLink`)는 원래부터 하이픈을 붙이지 않고 이름 입력 시 조립하는 구조이므로 이번 라운드의 변경사항이 아니라 기존 설계로 보임.
2. 375px 뷰포트에서 `computer` ref 클릭이 일부 케이스(연습책상 스탬프 버튼 첫 시도)에서 반응하지 않다가 데스크톱 폭에서는 정상 반응한 사례가 있었음 — 앱의 반응형 문제인지 이 세션의 Browser 패널 렌더링 문제인지 구분이 어려워 단정하지 않았다.

## 정리
- 프리뷰 서버(`netlify dev`, 8001포트)는 검증 종료 후 정리함.
- 텔레메트리 테스트로 생성했던 Supabase `codes`/`events` 테스트 행은 모두 삭제 확인함(0건).
- 로컬 `ax_student_code`(QA반-테스터)는 `#/reset`으로 정리됨.

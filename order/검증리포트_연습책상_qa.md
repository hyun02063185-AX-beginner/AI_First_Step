# qa-runner 보고 — AI_First_Step "연습 책상"(`/#/desk`, `js/desk.js`) 기능 회귀 검증

전제: Browser 패널이 사용자 쪽에 표시되지 않아 `computer` 스크린샷은 매번 타임아웃(`the Browser pane is not displayed, so the page is not compositing frames`)되어 사용 불가 — 전 항목을 DOM 상태·콘솔·네트워크·localStorage 조회(`javascript_tool`, `get_page_text`, `read_console_messages`, `read_network_requests`)로 대체 확인했습니다.

| 항목 | 결과 | 비고/재현 절차 |
|---|---|---|
| npm test | ✅ | `node --test` 133/133 통과 (content-lint·aggregate·functions-contract 포함, 신규 7건 포함) |
| 렌더 | ✅ | 06강(중간 표본)·01강(신규 아님, variant 표본 겸용) 슬라이드 텍스트가 `js/data.js`와 일치. 이번 라운드는 커리큘럼 콘텐츠 변경 없음(연습 책상만 추가) — `PRACTICE_MISSIONS` 20건 문구도 `data.js` 정의와 화면 표시가 1:1 일치 확인 |
| 티저 체인 | ✅ | 20강 전체 `closing.teaser` 존재(하네스 중복확인 아님, 표본 4개 텍스트 육안 확인: 01→02, 06→07, 11→12, 20=과정 종료 문구)로 끊김 없음 |
| 이어보기 | ✅ | 06강 4번째 슬라이드까지 진행 후 종료 → 상자 화면 카드에 `▶ 이어보기 4/12` 정상 표시 |
| 핵심 훑기 | ✅ | `#toc-btn` → `#toc-core` 클릭 시 `#toc-list`에 big/quote/closing 문구 정상 렌더 |
| 스킨 전수 | ✅ | office/paper/neon/sunset 4종 전환 시 콘솔 에러 0건. 명도대비 휴리스틱 스캔(존①~③ 버튼/카드/탭 40개 표본) 결과 neon·sunset(어두운 스킨) 0건 이상無. office/paper에서 2건 낮은 비율(1.2~1.3) 검출됐으나 확인 결과 배경이 `background-image`(그라디언트)라 내 스캐너가 투명 배경까지 타고 올라가며 오탐(실제 배경은 거의 흰색 `rgb(255,253,249)`이므로 실제 대비는 정상) — 재확인상 실결함 아님 |
| 375px | ✅ | mobile 프리셋(375×812)에서 존①/②/③ + 미리보기·내보내기 패널 + 입장 화면 모두 `document.body.scrollWidth === window.innerWidth`(375) — 가로 스크롤 없음 |
| 콘솔 0 | ✅ | 전 과정(입장→연습책상 3존 조작→강의 이동→variant→join→admin→스킨전수→375px) 통틀어 `read_console_messages` 0건 |
| 텔레메트리 | ✅ | `.env`에 `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` 존재. 테스트 코드 3종(`QARUN0723`/`QARUNCURL1`/`QARUNPAR1`)으로 `mission_stamp`·`kit_updated` 5건 실insert 확인(REST 조회로 payload까지 검증) → `stats` 함수 응답에서 `missionCount`·`kit.fields` 정상 집계(→ `admin.js`의 "연습 책상 · 미션 n/20 · 키트 m/3" 라인 로직과 매칭 확인) → DELETE로 전량 정리, 재조회 0건 재확인. 단, 브라우저에서 두 이벤트를 거의 동시에 fire했을 때 1건이 502로 드롭되는 것을 1회 관찰(같은 두 이벤트를 curl로 순차/병렬 재현 시엔 둘 다 204 — 재현 불가한 일회성 네트워크 플레이크로 판단, `track.js`는 설계상 fail-silent라 앱 동작에는 영향 없음) |
| variant 표본 | ✅ | `?variant=student`로 01강 슬라이드 인덱스6 진입 시 페르소나 오버라이드 문구("팀플 조장 박선배") 정상 합성 + HUD 뱃지 "S"(title="페르소나: 대학생") 정상. `?variant=personal`은 현재 `slidesPersonal`을 쓰는 강의가 데이터에 없어 미검증(연습 책상 변경과 무관한 기존 상태) |
| ?join= | ✅ | `?join=테스트반` 접속 시 코드 레이어 자동 오픈(`display:flex`) + `#scode-input` 값 `테스트반-` 프리필 확인 |
| #/admin | ✅ | `#/admin` 접속 시 "강사 전용" 키 입력 화면 노출, 로그인은 미실행. DOM에 ADMIN_KEY 문자열 노출 없음 확인 |
| 키 비노출 | ✅ | 본 보고서·명령 출력 어디에도 `.env`의 실제 값(SUPABASE_SERVICE_KEY/ADMIN_KEY/AI_API_KEY/SUPABASE_URL)을 원문으로 출력하지 않음(REST 호출은 쉘 변수로만 참조, curl -s로 응답 본문만 확인) |
| 존① 미션 스탬프판 (연습 책상 전용) | ✅ | 20개 카드가 로비/미팅룸/내 책상/보안 게이트 4구역으로 정확히 그룹핑(`boxIndex` 매칭). `완료 스탬프` 클릭 → `localStorage.desk_stamps`에 저장, 재클릭 시 해제(토글) 정상. 진행률 "n/20" 실시간 갱신. "06강에서 배웠어요" 클릭 시 `#/lecture/6`으로 정상 이동 |
| 존② 프롬프트 조립대 (연습 책상 전용) | ✅ | 상황/대상/모양 입력 시 하단에 실시간 조립 문장 생성(`input` 이벤트 기준 즉시 반영). 프리셋 "메일 다듬기" 클릭 시 3칸 정상 채움(구조상 나머지 2종도 동일 로직). "내 키트에 저장" 클릭 시 `desk_kit.prompts` 배열에 정상 추가 |
| 존③ 나의 시작 키트 (연습 책상 전용) | ✅ | 챗봇 입력/프롬프트·규칙 직접 추가(+추가)/삭제(✕) 정상 동작, `desk_kit` 저장 확인. 미리보기 카드는 프롬프트·규칙 추가/삭제 시 즉시(add/delete 핸들러에서 `refreshStage()` 직접 호출) 반영됨. **다만 "단짝 챗봇" 텍스트 입력칸만은 매 키입력(`input`)마다 카드에 반영되지 않고 포커스가 벗어나는 `change`(blur) 시점에만 카드가 갱신됨** — 데이터 저장 자체는 입력 즉시 `localStorage`에 반영되므로 유실은 없으나, "실시간 미리보기"라는 표현과는 다소 어긋나는 지점(아래 참고 참조). 미리보기·내보내기 패널은 정상 오픈, 복사(클립보드, try/catch)·인쇄(`window.print`) 버튼 모두 AX 진단실 제안서 패턴 그대로 재사용되어 정상 동작 |
| 라우터·텔레메트리 회귀 (main.js/telemetry.js) | ✅ | 강의 슬라이드 진행(`slide-next`/`slide-exit`)·상자(box) 진입·이어보기·페르소나·`?join=`·`#/reset`·`#/admin` 등 기존 라우팅 전부 정상. `Telemetry.missionStamp`는 스탬프-해제 시 호출 안 함(코드 상 add 분기에서만 호출) 확인, 재스탬프 시 재전송 방지는 `telemetry.js`의 `sentOnce` Set으로 기존 패턴과 동일하게 처리 — 신규 회귀 없음 |

## 참고 사항 (❌는 아니지만 판단이 필요해 보이는 관찰)

### 존③ "미리보기·내보내기" 패널이 씬 전환에 닫히지 않음 — 기존 앱 공유 패턴, 수용 가능

1. `/#/desk` 진입 → 존③(나의 시작 키트) → `#kit-export`("🎒 미리보기·내보내기") 클릭 → 패널 오픈.
2. 패널을 닫지 않은 채(✕ 클릭도 Escape도 없이) 주소를 `#/lecture/1`(전혀 다른 씬)로 이동.
3. `#desk-export`의 `hidden=false`, `class="pr-panel show"`가 씬 전환 후에도 유지되어 새 씬 위에 계속 떠 있다.
4. 다만 `js/practice.js`(AX 진단실 제안서 패널, id="pr-panel")를 확인한 결과 **동일한 구조(body 직속 append, 라우터와 비연동, hidden/class 토글만으로 관리)** — 이번 연습 책상 신규 개발로 생긴 회귀가 아니라 기존 앱 전반의 공유 패턴. 지시서상 "내보내기·연출은 진단실 자산 재사용 우선"이 그대로 반영된 결과. **수용 가능(기존 패턴 그대로 재사용) — 필요하면 추후 별도 라운드에서 두 패널 공통으로 개선.**

### 존③ 챗봇 입력칸의 "실시간" 미리보기 정도 — 의도된 설계

- `#kit-chatbot`은 `input` 이벤트에서 `saveKit()`만 호출하고, 카드 갱신(`refreshStage()`)은 `change`(blur) 이벤트에서만 호출된다. 프롬프트/규칙의 +추가·삭제는 클릭 즉시 카드에 반영되는 것과 대조적. **의도된 트레이드오프**: `refreshStage()`는 `#desk-stage`의 innerHTML을 통째로 교체하므로, 이걸 매 키입력마다 호출하면 입력 중인 `<input>`이 매번 재생성되어 커서 위치·포커스가 깨지는(입력 중 커서가 끝으로 튀거나 포커스 이탈) 더 나쁜 UX 버그가 된다 — 그래서 저장은 즉시, 미리보기 동기화는 blur 시점으로 분리했다. 데이터 유실은 없다.

## 관련 파일 경로 (참고용)
- `C:\Users\hyun0\AI_First_Step\js\desk.js` (신규 — 3존 로직, 스탬프/조립대/키트/내보내기)
- `C:\Users\hyun0\AI_First_Step\js\telemetry.js` (`missionStamp`/`kitUpdated`, 91–104행)
- `C:\Users\hyun0\AI_First_Step\netlify\functions\track.js` (`EVENT_TYPES`, 12–16행)
- `C:\Users\hyun0\AI_First_Step\netlify\functions\_shared\aggregate.js` (`missionCount`/`kit` 집계)
- `C:\Users\hyun0\AI_First_Step\js\admin.js` (394–395행, "연습 책상" 요약 라인)
- `C:\Users\hyun0\AI_First_Step\js\data.js` (1793–1814행, `PRACTICE_MISSIONS`)
- `C:\Users\hyun0\AI_First_Step\index.html` (82–90행, `#desk-door`; 219행, `#scene-desk`)
- `C:\Users\hyun0\AI_First_Step\css\style.css` (1215–1225행, `.pr-panel` 관련 — 참고 사항의 근거)

Netlify dev 서버(포트 8899)는 검증 종료 후 정리했습니다. Supabase에 남긴 QA 테스트 이벤트(`QARUN*` 코드 5건)는 전량 삭제 후 0건 재확인했습니다.

# boundary-keeper 보고 — AI_First_Step 워킹트리 미커밋 diff (`order/연습책상_지시서.md` 작업분, base: `b239334`)

검증 방법: `git status`/`git diff`로 14개 수정 파일 + 2개 신규 파일 전수 확인, `npm test`(133/133 통과) 재실행, 그리고 로컬에 존재하는 `AX_Lecture` 클론(`C:\Users\hyun0\AX_Lecture`, 현재 clean, `5805411`까지)을 직접 열어 대조 가능한 부분은 "확인 못함"이 아니라 실제로 확인했다.

## 분류표

| 파일 | 분류 | 비고 |
|---|---|---|
| `js/telemetry.js` | 공유 엔진(§1) | `missionStamp`/`kitUpdated` 2메서드 순수 추가. 기존 `diagnosis`/`checkup`/`proposal` 등 5메서드 라인 무변경 확인(diff에 `-` 없음) |
| `netlify/functions/track.js` | 공유 엔진(§1) | `EVENT_TYPES` Set에 2개 값 추가만. `RATE_LIMIT`·`MAX_BODY` 등 나머지 무변경 |
| `netlify/functions/_shared/aggregate.js` | 공유 엔진(§1) | `summarizeStudent()`에 `missions`/`kit` 지역변수 + else-if 분기 2개 + 리턴 필드 2개 추가만. 기존 `diagnosis_result`/`checkup_result`/`proposal_created` 분기 무변경 |
| `js/admin.js` | 공유 엔진(§1) | 수강생 상세 렌더에 한 줄(`parts.push(...)`) 추가만 |
| `css/style.css` | 공유 엔진(§1, 스켈레톤) | 인쇄 블록에 `#desk-export` 규칙 2줄 추가 + `.desk-*` 신규 셀렉터 블록 추가. 기존 셀렉터 라인 무변경(순수 append) |
| `js/main.js` | **공유 엔진(§1)** | ⚠ 사용자 배경 설명에는 빠져 있으나 실제로 수정됨(§1 표에 명시된 "씬 매니저·해시 라우터" 그 자체). `scene-desk` 참조·`case "desk"` 라우트·`reset`/`start` 케이스에 `Desk` 훅 추가 — 전부 순수 추가, `case "practice"` 등 기존 케이스 불변. 아래 "백포트 후보"·"경계 침범" 항목에서 별도로 다룸 |
| `js/site-config.js` | 사이트 고유(§2) | `practiceDesk: true` 1줄 추가 |
| `js/data.js` | 사이트 고유(§2) | `PRACTICE_MISSIONS`(20개) 신설 + `module.exports`에 추가. `CURRICULUM` 등 기존 데이터 무변경 |
| `index.html` | **미분류(신규 애매 항목, 아래 참고)** | `#desk-door`/`#scene-desk`/`<script src="js/desk.js">` 추가 |
| `js/desk.js`(신규) | 사이트 고유(§2) | 본문 참고 — §2 표 등재 타당성 검토(아래) |
| `tests/content-lint.test.js` | 공유 규범(§4) — **예외 적용** | `PRACTICE_MISSIONS` 린트 4건 추가. §4 예외 목록의 "사이트 고유 구조 검사"에 해당(본진의 `slidesPersonal` 검사 블록과 동일 성격) — 골격 동기화 대상, 이 블록 자체는 조정 허용 |
| `tests/functions-contract.test.js` | 공유 규범(§4) — **예외 미비, 아래 참고** | `mission_stamp`/`kit_updated`/`stats` 집계 테스트 3건 추가. §4 표에는 이 파일이 "사이트별 차이가 없는 부분"으로 명시돼 있어 예외가 아님 — 오늘 diff로 그 전제가 깨졌다(아래 상세) |
| `docs/엔진_경계.md` | 공유 규범(§4, 코어) | §2 표에 `js/desk.js` 행 신설 + §7에 신규 이력 항목 추가 |
| `docs/운영자_치트시트.md` | 공유 규범(§4) — **예외 적용** | 진단실/`?unlock=1`/이벤트 6종→5종 절 정리는 §4 예외("그 사이트에 없는 기능 관련 절은 뺄 수 있다")에 정확히 해당 |
| `docs/콘텐츠_현황.md` | 공유 규범에 준함(§7 2026-07-22 신설 취지) | 사실 스냅샷 성격 — 예외 취급 |
| `order/연습책상_지시서.md`(신규) | 분류 대상 외(작업 지시서) | 실행 근거 문서, §1~4 분류표 밖 |

## 백포트 후보

- **`js/telemetry.js`(missionStamp/kitUpdated) · `netlify/functions/track.js`(EVENT_TYPES 2건) · `netlify/functions/_shared/aggregate.js`(missionCount/kit 집계) · `js/admin.js`(연습 책상 한 줄)** — 방향: 첫걸음→본진. 다만 **지금 실행하지 않는 게 맞다**고 판단. 순수 additive라 백포트해도 안전은 하지만, `PRACTICE_MISSIONS`/`SITE_CONFIG.practiceDesk` 없이는 본진에서 죽은 코드(영구 "미션 0/20 · 키트 0/3")가 되고, 지시서가 "AI_First_Step에서 실행 + §7 이식 대상 보고"로 범위를 명시적으로 좁혀 원 지시가 이미 이 판단을 뒷받침한다. §1의 "버그·구조 개선이면 반영" 원칙도 엄밀히는 이 케이스(버그도 구조개선도 아닌, 사이트 전용 데이터 의존 신규 기능)에 딱 들어맞지 않는다 — **위반이 아니라 정당한 예외**로 판단.
- **`js/main.js`(scene-desk 참조·`case "desk"` 라우트)** — 같은 논리로 방향: 첫걸음→본진, 같은 이유(SITE_CONFIG.practiceDesk 게이트로 안전하게 no-op)로 보류가 타당. **다만 이 파일이 §7 로그의 "§1 공유 엔진 파일을 건드린 부분" 목록에서 누락돼 있다** — 아래 "이식 이력 기록 제안"에서 보완 필요.
- **`tests/functions-contract.test.js`(mission_stamp/kit_updated/stats 집계 테스트 3건)** — 방향: 첫걸음→본진(코드가 아니라 §4 규범이지만 성격은 같음). 코드 백포트를 보류했으니 테스트 백포트도 같이 보류하는 게 일관적이나, §4 표는 이 파일을 "사이트별 차이 없음"으로 명시해뒀던 터라 오늘부로 그 전제가 깨졌다는 사실 자체가 문서에 기록돼 있지 않다.

## 경계 침범

침범 없음(콘텐츠 작업 중 목적 없이 엔진을 건드린 사례는 없음) — 다만 아래 3가지는 "침범"까지는 아니어도 boundary-keeper가 짚어야 할 애매/누락 지점:

1. **§7 기록 누락**: 이번 §7 신규 항목이 "§1 공유 엔진 파일을 건드린 부분"으로 `js/telemetry.js`·`netlify/functions/track.js`·`netlify/functions/_shared/aggregate.js`·`js/admin.js` 4개만 열거했는데, 실제로는 `js/main.js`(§1)도 건드렸고 `tests/content-lint.test.js`·`tests/functions-contract.test.js`(§4)도 건드렸다. 판단(백포트 보류) 자체는 타당하지만, **기록이 실제 diff보다 좁다** — 커밋 전에 보완 권장.
2. **`index.html` 분류 공백**: `#practice-door`/`#scene-practice`는 두 저장소 index.html에 동일하게 존재(구조는 공유, 게이팅만 config로 제어)하는데, `#desk-door`/`#scene-desk`는 이번에 첫걸음에만 추가됐다. `docs/엔진_경계.md` §1·§2 어디에도 `index.html` 자체가 분류돼 있지 않다(§3에 인트로 그리드 문맥으로만 스치듯 언급). 오늘 변경은 문제없이 additive지만, index.html이 "구조는 공유·문구/도어는 사이트 고유"인 혼합 파일이라는 게 반복적으로 드러나는 만큼 **신규 애매 항목**으로 §3에 등재를 검토할 만하다.
3. **`tests/functions-contract.test.js`의 "사이트별 차이 없음" 전제 붕괴**: §4 표 문구를 문자 그대로 적용하면 이 파일은 동기화 대상이며 "사이트별 차이가 없어야" 하는데, 오늘 이후로는 이 저장소에만 mission_stamp/kit_updated 테스트가 있어 차이가 생겼다. §4 예외 목록(content-lint의 "사이트 고유 구조 검사"급 표현)에 이 파일용 문구가 없다 — 애매하다고 명시한다.

## 공유 규범 동기화

- `docs/엔진_경계.md` — **동기화 필요, 확인함(부분 불필요)**: §2 표의 `js/desk.js` 행은 본진에 대응 파일이 없으므로(직접 `AX_Lecture` 확인: `desk`/`mission_stamp`/`practiceDesk` grep 전무) 미러링 불필요 — 본진 §2 표도 첫걸음 전용 파일을 열거하지 않는 관행과 일치. 그러나 §7 신규 항목은 다르다: `docs/엔진_경계.md`는 §4 코어(예외 아님)이고 §4 절차상 "상대 저장소에 언제·어떻게 반영했는지(또는 반영 보류 사유)를 이력으로 남긴다"가 요구되는데, **본진 `docs/엔진_경계.md`에는 이 "백포트 후보 발견·보류" 사실이 전혀 반영돼 있지 않다**(직접 확인). 코드 영향은 0이라 급하지 않지만, 짧은 참고용 한 줄(아래 제안 문안)을 본진 §7에도 남겨두는 걸 권장 — 안 남기면 향후 본진 쪽 boundary-keeper가 이 후보의 존재 자체를 첫걸음 저장소를 뒤지지 않고는 알 수 없다.
- `docs/운영자_치트시트.md` — **사이트별 조정 허용 예외**: §4 예외 목록에 정확히 명시된 케이스. 진단실/`?unlock=1` 절 삭제, 이벤트 5종 표 갱신 전부 "그 사이트에 없는 기능 관련 절은 뺄 수 있다"에 해당 — 동기화 불필요.
- `docs/콘텐츠_현황.md` — **사이트별 조정 허용 예외(§7 2026-07-22 신설 취지에 준함)**: 순수 이 사이트 사실 스냅샷. 동기화 불필요.
- `tests/content-lint.test.js` — **사이트별 조정 허용 예외**: §4 예외의 "사이트 고유 구조 검사" 조항이 커버. 골격(assert 패턴)은 기존과 동일 스타일 유지돼 있어 문제없음.
- `tests/functions-contract.test.js` — **동기화 필요 — 확인함(현재는 미실행이 타당하나 기록 없음)**: 위 "경계 침범" 3번 참고. 본진에 대응 테스트 없음을 확인했고, 이는 §1 코드 백포트 보류와 논리적으로 결이 같아 지금 당장 문제는 아니나, §7/§4 어디에도 "이 테스트 파일도 같은 이유로 함께 보류"라는 근거가 적혀 있지 않다.

## 이식 이력 기록 제안 문안

이 저장소 `docs/엔진_경계.md` §7 기존 항목(2026-07-23 — 연습 책상 신설) 보완용 추가 문단 제안:

> **보완**: "§1 공유 엔진 파일을 건드린 부분" 목록에 `js/main.js`(씬 매니저에 `scene-desk` 참조, 해시 라우터에 `case "desk"` 추가 — `SITE_CONFIG.practiceDesk`로 게이트돼 있어 본진에 그대로 있어도 no-op)를 추가 기재한다. 아울러 `tests/content-lint.test.js`(§4 예외 — `PRACTICE_MISSIONS` 사이트 고유 구조 검사)·`tests/functions-contract.test.js`(§4, mission_stamp/kit_updated/stats 계약 테스트 3건 — 위 §1 코드와 동일한 이유로 백포트 보류)도 이번 라운드에 함께 확장됐음을 명시한다.

본진(`AX_Lecture`) `docs/엔진_경계.md` §7에 남길 짧은 참고용 문안(선택, 코드 영향 없음이므로 급하지 않음):

> ### 2026-07-23 — 첫걸음 "연습 책상" 신설, §1 확장분 백포트 후보 발견(참고, 실행 없음)
> 첫걸음(AI_First_Step) `order/연습책상_지시서.md`에서 연습 책상(3존 실습 공간) 신설. `js/telemetry.js`(missionStamp/kitUpdated)·`netlify/functions/track.js`(EVENT_TYPES 2건)·`_shared/aggregate.js`(missionCount/kit 집계)·`js/admin.js`(표시 한 줄)·`js/main.js`(desk 라우트, config 게이트)를 확장했으나 `PRACTICE_MISSIONS`/`SITE_CONFIG.practiceDesk` 의존적이라 본진엔 백포트하지 않음(그대로 반영 시 죽은 코드). 본진에 유사 실습 공간 수요가 생기면 그때 첫걸음 코드를 참고해 이식 여부 재검토. 본진 파일은 변경 없음.

## 요약 답변(사용자 질문 대응)

1. §1 파일 5종(telemetry/track/aggregate/admin/style.css) 전부 diff로 직접 확인 — 순수 additive, 기존 로직 삭제·변경 없음. `js/main.js`도 같은 성질(추가만) 확인했으나 애초에 §7 목록에 없었다는 점이 발견 사항.
2. 지금 백포트하지 않는 판단은 §1/§5 원칙 위반이 아니라고 본다 — 지시서의 명시적 범위 축소가 근거이고, 버그도 구조개선도 아닌 "사이트 전용 데이터 의존 신규 기능"이라는 성격이 §1 원칙의 이분법(버그/구조개선) 밖에 있다. 다만 이런 패턴이 반복될 걸 대비해 §1 문구에 "사이트 전용 데이터 의존 신규 확장은 상대 사이트에 대응 콘텐츠가 생기기 전까지 백포트 보류 가능"이라는 예외를 명문화해두면 다음번엔 매번 지시서 텍스트에 기대지 않아도 된다(제안, 필수 아님).
3. `js/desk.js`/`PRACTICE_MISSIONS`는 §2 분류가 맞다고 판단 — `js/practice.js`처럼 "재사용 가치 있는 뼈대"를 자체 보유하지 않고(탭/카드/인쇄 골격은 이미 §1 CSS의 `.pr-*`/`.axp-*`를 그대로 재사용), 07/10/16/19/20강처럼 이 커리큘럼 강 번호에 강하게 결합된 순수 비즈니스 로직이라 §3(경계 애매)보다 §2가 정확하다. 이미 추가된 §2 표 행도 적절하다.
4. `운영자_치트시트.md`·`콘텐츠_현황.md`는 §4 예외(또는 준하는 취급)라 본진 동기화 불필요. `엔진_경계.md`는 §4 코어라 원칙적으로 동기화 대상이지만, §2 행(desk.js)은 본진에 대응물이 없어 미러링 불필요, §7 항목은 본진에 짧은 참고 문안을 남기는 걸 권장(급하지 않음, 위 문안 참고).
5. `git status` 전수 확인 결과 사용자가 나열한 16개 파일과 실제 변경 파일이 정확히 일치 — 목록 밖 파일 없음.

# boundary-keeper 규범 동기화 검사 — 2026-07-24 (마일스톤 마감 사전 점검)

## 대조 결과

| 파일 | 상태 | 비고 |
|---|---|---|
| `.claude/agents/boundary-keeper.md` | 동일 | 바이트 단위 diff 0 |
| `.claude/agents/release-manager.md` | 동일 | 바이트 단위 diff 0 |
| `.claude/agents/persona-reviewer.md` | 차이(정당) | 페르소나(첫걸음: 김주임/박선배/최사장 다중) vs 단일 관점(본진, 페르소나 미이식) — §4 예외 그대로 |
| `.claude/agents/qa-runner.md` | 차이(정당) | `?variant=<페르소나키>`/스킨 5종 표본(첫걸음) vs `?variant=personal`+진단실 표본(본진) — §4 예외 그대로 |
| `.claude/agents/tone-keeper.md` | 차이(대부분 정당, 일부 애매) | §2(어투)·§3(용어)·§5(도식 톤) 차이는 §4 예외 문구 그대로 적용. **단 "페르소나 원칙"(톤앤매너 §4 대응) 항목의 차이는 §4 예외 목록이 명시적으로 "§2·§3"만 열거하고 있어 문언상 예외 범위 밖 — 아래 "방치된 갭" 참고** |
| `docs/UX_원칙.md` | 동일(사실상) | 유일한 diff는 자기참조 경로 표기(`order/...` vs `AI_First_Step/order/...`) — 상호 참조 시 저장소 위치가 다르니 당연한 차이, 실질 내용 diff 0 |
| `docs/엔진_경계.md` | 구조 동일, 이력 갭 있음 | §1~§6 조문 구조·번호·내용 사실상 일치(§3 slidesVariants/slidesPersonal 항목 양쪽에 자기 시점으로 대응 서술 확인, §4 예외 목록 4개 불릿 양쪽 동일). **§7 로그에 이번 라운드 §1 엔진 확장 1건 미기록 — 아래 "방치된 갭" 참고** |
| `docs/에이전트_운영.md` | 핵심 절차 동일 | 표준 파이프라인·하네스 관계·순차 실행 규칙 등 핵심 절차 문구 일치. "~판과의 차이" 절은 정당한 비대칭. **테스트 수치("126"/"86")가 양쪽 다 stale(실제 149/96)— 상호 불일치는 아니고 각자 자기 문서가 과거 시점에 멈춰 있는 것(경미)** |
| `docs/톤앤매너.md` | 사이트별 조정 허용 예외 | §1~§8 번호 체계·조문 골격 일치, §1 규격 수치(13~17 vs 12~14)·§4 페르소나 내용·§8 상호 참조 모두 의도된 비대칭. 최근 신설된 §4⑦(공유 슬라이드 판 종속 참조 예외)은 첫걸음 전용 조항이며 본진엔 대응 조항 불필요(본진은 페르소나 자체가 없어 해당 문제 상황이 발생하지 않음) — 이건 정당 |
| `docs/운영자_치트시트.md` | 사이트별 조정 허용 예외 | 최근 무대뒤.판.* 3종 반영은 첫걸음판 표에만 있음 — 본진에 해당 기능 자체가 없어 정당 |
| `tests/aggregate.test.js` | 동일 | 바이트 단위 diff 0 |
| `tests/functions-contract.test.js` | 골격 동일, 사이트별 확장 정당 | codes/track/stats/brief 핵심 계약 테스트는 동일 구조. 첫걸음의 mission_stamp/kit_updated 테스트 3건은 연습 책상 전용 확장(§4 예외, 이미 §7에 기록됨). 사소하게 본진에만 있는 주석 한 줄("A반부-누구" 설명, 실제 테스트 코드는 양쪽 다 있음 — 주석 누락일 뿐 기능 갭 아님) |
| `tests/content-lint.test.js` | 골격 동일, 사이트별 블록 정당 | 헤더 주석에 "본진판" 이식 이력과 사이트별 조정 지점(첫걸음: `PRACTICE_MISSIONS`/`slidesVariants`, 본진: `slidesPersonal`)을 각자 명시 — 두 파일 다 자기 문서화가 잘 돼 있음 |
| `tests/layout-invariants.test.js` | **첫걸음에만 존재 — 이식 미검토** | 아래 "방치된 갭" 참고 |

## 방치된 갭

- **`js/telemetry.js`·`js/main.js`의 `무대뒤.판.*`(판.자영업/판.대학생/판.기본) 확장 — §7 이력 기록 누락**
  커밋 `dafcd0d`("최사장 완결")에서 §1 공유 엔진 파일(`js/telemetry.js`의 `HIDDEN_COMMANDS`,
  `js/main.js`의 `CHEAT_PERSONA_KEY`/`App.cheatSetPersona`)이 확장됐다. 지시서(`order/최사장_완결_지시서.md`)
  자체에 "AX_Lecture 무변경(히든코드 판 명령은 첫걸음 전용 — AX는 페르소나 없음)"이라고 판단 근거가
  적혀 있어 **본진에 이식하지 않기로 한 판단 자체는 타당**하다(`SITE_CONFIG.personas` 부재로 본진에서는
  `available()`이 자동 false가 되는 동일한 "데이터 주도 no-op" 패턴 — 기존 히든코드 이식 때 확립된
  방식과 같음). 문제는 이 판단이 `docs/엔진_경계.md` §7에 전혀 기록되지 않았다는 점이다 — 직전
  "연습 책상 신설" 항목(2026-07-23)은 같은 성격의 §1 확장(백포트 후보이나 미실행)을 §7에 한 문단
  통째로 남겨 감사 가능하게 해뒀는데, 이번 라운드는 그 관행이 끊겼다.
  → **해소 제안**: 첫걸음 `docs/엔진_경계.md` §7에 "2026-07-24 — 무대뒤.판.* 신설, §1 공유 엔진
  확장분은 백포트 후보 보고만(실행 안 함, 이유: 본진에 `SITE_CONFIG.personas` 없어 no-op)" 항목을
  소급 추가. 본진 쪽은 반영 불필요(정당하게 대상 아님 확인됐으므로), 다만 본진 §7에도 "확인 후 스킵"
  한 줄을 남겨 향후 감사에서 재작업하지 않도록 하는 것을 권장.

- **`.claude/agents/tone-keeper.md`의 "페르소나 원칙" 항목(§4⑦ 반영) — §4 예외 목록 문언 공백**
  커밋 `44e841a`에서 `tone-keeper.md`의 "페르소나 원칙" 판정 문구가 갱신됐다(§4⑦ 예외 우선 확인
  절차 추가). 이 변경은 본진에 반영되지 않았는데, 그 자체는 정당하다(본진은 페르소나 시스템이 없어
  §4⑦ 같은 예외가 발생할 여지가 없음). 다만 `docs/엔진_경계.md` §4의 "사이트별 조정 허용" 예외
  목록은 `tone-keeper.md`의 **"§2(어투)·§3(용어) 관련 세부 서술"만 명시적으로 열거**하고 있어,
  "페르소나 원칙"(톤앤매너 §4 대응) 항목의 차이를 근거 지어줄 문구가 없다 — 이건 과거
  boundary-keeper가 발견해 고쳤던 "§4 예외 목록에 `.claude/agents/*`가 빠져 있던" 갭과 같은
  패턴의 재발이다(범위는 훨씬 좁지만).
  → **해소 제안**: `docs/엔진_경계.md` §4 예외 목록의 tone-keeper.md 관련 불릿에 "§4(페르소나)"를
  추가해 "§2·§3·§4 관련 세부 서술"로 확장. 양쪽 저장소 동시 반영(문서 동기화이므로).

- **`tests/layout-invariants.test.js` — 본진 이식 여부 미검토(첫걸음에만 존재)**
  이 파일은 `#scene-practice`·`#scene-desk` 두 씬에 대해 ".scene 기본값(display:flex)을
  display:block으로 오버라이드했는지" CSS 불변식을 검사한다. `#scene-desk` 부분은 첫걸음 전용
  기능(연습 책상)에 국한되지만, **`#scene-practice` 부분은 본진에도 그대로 적용 가능한 회귀 테스트다**
  — 본진은 진단실(`#scene-practice`)을 갖고 있고 실제로 동일한 CSS 규칙(`#scene-practice{display:block;
  overflow-y:auto}`)이 이미 존재한다(2026-07-21 최초 백포트 버그픽스 계열과 같은 종류의 레이아웃
  불변식). 그런데 이 CSS 규칙을 지켜주는 결정론적 테스트가 본진에는 없다 — 첫걸음의 연습 책상
  레이아웃 사고(2026-07-23, 시각검증체계_지시서.md 계기)와 똑같은 유형의 회귀가 본진의 진단실
  화면에서 나더라도 `npm test`로는 못 잡는다. 이 파일 자체나 이식 필요성이 지금까지 어느 §7 로그에도
  언급된 적이 없다 — 순수한 방치(누구도 판단하지 않은 상태)로 보인다.
  → **해소 제안**: 첫걸음 → 본진 방향으로, `#scene-practice` 검사 부분만 골라(desk 부분 제외)
  본진 `tests/layout-invariants.test.js`로 이식할지 사람이 결정. 실행 자체는 이 보고서의 범위 밖.

## 이력 기록 제안 문안

- 첫걸음 `docs/엔진_경계.md` §7 소급 추가안:
  > ### 2026-07-24 — 무대뒤.판.* 신설(페르소나 전환 히든코드), §1 공유 엔진 확장분은 백포트 후보 보고만(실행 안 함)
  > - **출처**: 이 저장소, `order/최사장_완결_지시서.md` Part 4 — 강사 전용 히든코드로 페르소나
  >   전환(`무대뒤.판.자영업`/`무대뒤.판.대학생`/`무대뒤.판.기본`)을 추가.
  > - **§1 공유 엔진 파일을 건드린 부분(백포트 후보로 보고만 — 실행하지 않음)**: `js/telemetry.js`
  >   (`HIDDEN_COMMANDS`에 판.* 3건 추가), `js/main.js`(`CHEAT_PERSONA_KEY`·`App.cheatSetPersona`
  >   신규, 기존 `#/reset` 정리 로직에 항목 추가). 전부 `SITE_CONFIG.personas` 존재 여부로
  >   `available()`이 게이트돼 있어, 본진에 그대로 있어도 no-op(이전 "연습 책상"·"히든코드 체계"
  >   이식과 같은 패턴). 지시서 자체가 "AX_Lecture 무변경(히든코드 판 명령은 첫걸음 전용)"이라고
  >   명시해 실행이 아니라 보고로 마무리한다.
  > - **검증**: `npm test` 149/149 통과. boundary-keeper 규범 동기화 검사(2026-07-24)에서 §7 기록
  >   누락을 발견해 소급 기재.

- 양쪽 `docs/엔진_경계.md` §4 예외 목록 수정안 (한 줄 교체):
  > (기존) "`.claude/agents/tone-keeper.md`의 §2(어투)·§3(용어) 관련 세부 서술, ..."
  > (수정) "`.claude/agents/tone-keeper.md`의 §2(어투)·§3(용어)·§4(페르소나) 관련 세부 서술, ..."
  > (개정 사유: boundary-keeper 규범 동기화 검사에서 §4⑦ 반영 시 이 문구가 "페르소나 원칙" 항목의
  > 정당한 차이를 근거 지어주지 못하는 공백을 발견, 명시적으로 등재.)

## 확인 후 스킵 대상 (참고용 — 갭 아님)

이번 라운드에서 첫걸음에 추가된 아래 항목들은 "누락"이 아니라 **의도적으로 본진에 이식하지 않기로
한 항목**으로, 양쪽 문서(`docs/엔진_경계.md` §3·§4, `docs/톤앤매너.md` §4, `.claude/agents/
tone-keeper.md`/`persona-reviewer.md`/`qa-runner.md`)에 이미 정확히 반영돼 있다.

- `slidesVariants`(첫걸음) vs `slidesPersonal`(본진) 구조 비대칭 — `엔진_경계.md` §3에 양쪽 자기
  시점으로 대응 서술 존재, 확인 완료.
- 페르소나 3판(김주임/박선배/최사장), `js/site-config.js`의 `personas`, `js/desk.js`의 페르소나별
  존①·존② 콘텐츠, `docs/페르소나_작성_가이드.md` — 전부 §2(사이트 고유)/§4⑦ 대상, 본진엔 대응
  기능 자체가 없어 이식 불필요.
- `tone-keeper.md`·`persona-reviewer.md`의 본체 판정 기준(위 "페르소나 원칙" 문언 공백 지적 제외)은
  §4 예외로 이미 잘 규율돼 있음.

## 본진에만 있고 첫걸음 이식 필요 항목 (검사 결과)

없음. 본진의 최근 커밋(`8edba6c` 히든코드 체계까지)은 모두 §7 로그에 기록된 대로 첫걸음에
`146afd2`로 이미 이식·반영돼 있음을 파일 대조로 확인(`netlify/functions/codes.js`·`stats.js`·
`brief.js`·`js/vendor/qrcode.js` 바이트 동일, `track.js`·`telemetry.js`·`main.js`의 §1 부분 구조
일치, 사이트 고유 확장만 추가돼 있음). 본진 쪽에 첫걸음이 아직 못 따라간 미반영 라운드는 발견되지
않았다.

---

**요약**: 핵심 공유 규범 파일(`.claude/agents/boundary-keeper.md`·`release-manager.md`·
`docs/UX_원칙.md`·`docs/엔진_경계.md` 본문 구조)은 동기화 상태 양호. 실질적인 갭은 두 가지 —
① 이번 라운드(`무대뒤.판.*`)의 §1 엔진 확장이 과거 관행과 달리 §7에 기록되지 않은 이력 기록 누락,
② `엔진_경계.md` §4 예외 목록 문언이 tone-keeper.md의 "페르소나 원칙" 차이를 명시적으로 포괄하지
못하는 문언 공백. 둘 다 코드 동작에는 영향 없는 "기록/문서 정합성" 이슈이며, 실행은 사용자 판단.
추가로 `tests/layout-invariants.test.js`의 `#scene-practice` 부분은 본진 이식을 검토해볼 만한
방치된 항목으로 제안한다.

관련 파일 경로:
- `C:\Users\hyun0\AI_First_Step\docs\엔진_경계.md`
- `C:\Users\hyun0\AX_Lecture\docs\엔진_경계.md`
- `C:\Users\hyun0\AI_First_Step\.claude\agents\tone-keeper.md`
- `C:\Users\hyun0\AX_Lecture\.claude\agents\tone-keeper.md`
- `C:\Users\hyun0\AI_First_Step\js\telemetry.js`
- `C:\Users\hyun0\AI_First_Step\js\main.js`
- `C:\Users\hyun0\AI_First_Step\tests\layout-invariants.test.js`
- `C:\Users\hyun0\AI_First_Step\docs\에이전트_운영.md`
- `C:\Users\hyun0\AX_Lecture\docs\에이전트_운영.md`

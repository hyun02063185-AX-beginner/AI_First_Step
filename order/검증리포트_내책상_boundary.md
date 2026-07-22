# boundary-keeper 보고 — 작업 트리 미커밋 변경분 (`git status`/`git diff` 기준)

> `order/내책상_슬라이드_지시서.md` 검증 파이프라인 산출물. boundary-keeper 서브에이전트(네이티브 가동).
> **보고서만 — 이식 실행 없음.**

---

## 분류표
| 파일 | 분류 | 비고 |
|---|---|---|
| `js/data.js` | 사이트 고유 | 엔진_경계.md §2 명시 대상("전량 교체 대상"). diff는 단일 hunk(883번 줄~), `id: 11`~`id: 15`(내 책상 구역) 슬라이드 배열 내부만 수정. `CURRICULUM` 구조·헬퍼 함수·다른 강의(id 1~10, 16~20)는 무변경. 새 슬라이드는 기존에 이미 쓰이던 `cover`/`big`/`bullets`/`split`/`quote`/`closing`/**`image`** 타입만 사용 |
| `assets/diagram-summary-shapes.svg` | 사이트 고유 | 엔진_경계.md §2 `assets/*` — 12강 `image` 슬라이드가 참조 |
| `assets/diagram-search-vs-ai.svg` | 사이트 고유 | 엔진_경계.md §2 `assets/*` — 15강 `image` 슬라이드가 참조 |
| `order/내책상_슬라이드_지시서.md` | 분류 대상 외(작업 지시서) | `docs/`가 아니라 `order/` 디렉터리 — 엔진_경계.md §1/§2/§4 어디에도 안 걸리는 프로젝트 관리용 지시 문서. 공유 규범(§4) 대상 아님(코드/규범 문서가 아니라 이번 작업 1회성 지시서) |

## 백포트 후보
- 없음. `js/slides.js`·`js/room.js`·`js/main.js`·`js/telemetry.js`·`js/admin.js`·`netlify/functions/*`·`css/style.css` 스켈레톤 등 §1 공유 엔진 파일은 이번 diff에 전혀 포함되지 않음. 새로 쓴 `type: 'image'` 슬라이드도 `js/slides.js`의 기존 `case "image":` 렌더러를 그대로 재사용했을 뿐, 엔진 쪽 신규 필드나 신규 case를 요구하지 않았음.

## 경계 침범
- 침범 없음. `git status --porcelain`으로 확인한 변경 파일은 `js/data.js`(수정) + 신규 `assets/*.svg` 2건 + 신규 `order/*.md` 1건이 전부이며, 공유 엔진(§1) 목록에 속한 파일은 하나도 손대지 않았음.

## 공유 규범 동기화
- 해당 없음. §4 목록(`docs/UX_원칙.md`·`docs/엔진_경계.md`·`docs/에이전트_운영.md`·`.claude/agents/*`·`tests/` 공통 골격)에 속한 파일은 이번 diff에 걸려 있지 않음.

## 이식 이력 기록 제안 문안
- 백포트/이식 대상이 아니므로 `docs/엔진_경계.md` §5·§4 이력에 남길 내용 없음.

## 부가 확인 사항
- `npm test`(`node --test`, 126 테스트) 전부 통과 — 11~15강 각각 "slides 비어있지 않음/첫=cover·마지막=closing/타입·필수필드 유효/closing.teaser 존재/slidesVariants 유효" 통과 확인.
- 결론: 이번 diff는 의도대로 콘텐츠 전용 작업이며 엔진 경계 침범 없음.

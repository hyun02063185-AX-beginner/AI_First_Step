# release-manager 계획 — 로비+미팅룸 콘텐츠 완성, 페르소나 variant 기반 구축 (최근 3개 커밋)

> `order/에이전트체계_구축_지시서.md` §C "첫 가동 검증" 산출물. release-manager 서브에이전트
> **정의 검증용 모의 실행** — 실제 병합·태그·push는 수행하지 않았다. 승인 게이트에서 정확히 멈추는지
> 확인하는 것이 목적.

---

## 병합 전 점검
- 미커밋: 트래킹 대상 파일 변경 없음(clean). 단, 미추적(untracked) 파일 3건 존재 —
  `docs/톤앤매너.md`, `order/에이전트체계_구축_지시서.md`, `order/하네스_구축_지시서.md`.
  이 중 `docs/톤앤매너.md`는 콘텐츠 문서로 보이므로 마감 범위에 포함할지 확인 필요(현재 커밋에는
  안 잡혀 있음).
- 브랜치 구조: 별도 feature 브랜치 없이 **로컬 `main`이 `origin/main` 대비 3개 커밋 앞선 상태**
  (`a445702`, `89143d0`, `a009dc2`). 즉 이번 마감은 "브랜치 병합"이 아니라 **로컬 main → origin/main
  push**가 실질적 절차임. 병합 충돌 가능성: 없음(병합 대상 브랜치 자체가 없음).
- 해당 3개 커밋 요약:
  - `a445702` 미팅룸 06~10강 콘텐츠 + 도식 1종 (js/data.js, assets/diagram-dialogue-loop.svg, order/*)
  - `89143d0` 페르소나 variant 기반: 부분 오버라이드 + 레지스트리 + 작성 가이드 (js/main.js, site-config.js, slides.js, telemetry.js, data.js, 문서 2건)
  - `a009dc2` 로비 01~05강 콘텐츠 + 도식 2종(라이트) (js/data.js, assets/diagram-daily-ai.svg, assets/diagram-next-word-intro.svg, order/*)
- 기존 태그: `git tag -l` 결과 이 저장소에는 `v0.1-skeleton` 1건만 존재. 반면
  `docs/운영자_치트시트.md` §11 표에는 `v-demoday`, `v-curriculum-15min`, `v1.1-lms-foundation`이
  적혀 있는데 이는 이 저장소의 실제 태그와 **일치하지 않음**(본진 문서를 복제하면서 태그 이력까지
  함께 들어온 것으로 추정 — 이번 저장소 고유 이력은 `v0.1-skeleton`부터 시작). 태그명은 이 저장소
  실제 이력(`v0.1-skeleton` 기준)을 잇는 것으로 제안함.

## qa-runner 회귀 요약
- (모의 — 이번 정의 검증에서는 실제 하위 에이전트를 호출하지 않음, 실전에서는 Agent 도구로
  qa-runner/boundary-keeper를 호출)

## boundary-keeper 요약
- (모의 — 이번 정의 검증에서는 실제 하위 에이전트를 호출하지 않음, 실전에서는 Agent 도구로
  qa-runner/boundary-keeper를 호출)

## 실행 계획
1. 병합: 해당 없음 — 별도 브랜치 없이 로컬 `main`이 이미 3개 커밋 앞선 상태. (필요 시) 미추적
   `docs/톤앤매너.md` 등을 이번 범위에 포함할지 먼저 확정 후 커밋.
2. 태그: `v0.2-lobby-meetingroom-persona-variant` (제안) — 근거: 이 저장소의 실제 유일 선행 태그
   `v0.1-skeleton`을 잇는 순번(0.1 → 0.2), 이번 마감 범위(로비+미팅룸 콘텐츠, 페르소나 variant 기반)를
   태그명에 직접 반영. `docs/운영자_치트시트.md` §11 표와의 불일치는 별도 확인/정정 필요.
3. push: `origin main` (1회) — 로컬에 쌓인 3개 커밋을 원격에 반영.
4. 인계 확인 항목:
   - 미추적 문서 3건(`docs/톤앤매너.md`, `order/에이전트체계_구축_지시서.md`,
     `order/하네스_구축_지시서.md`) 처리 방침 확정(포함/제외)
   - `docs/운영자_치트시트.md` §11 태그표와 실제 저장소 태그 이력 불일치 정리
   - 본진(원본 프로젝트) 무변경 여부 — 이번 저장소는 "본진 복제" 산출물이므로 본진 디렉터리/파일
     미접촉 확인
   - 테스트/더미 데이터 0건 여부(telemetry, admin 관련 파일 변경분 포함된 `89143d0` 커밋 확인)

## 승인 대기
승인 문구가 없으므로 여기서 멈춥니다. 위 계획대로 진행해도 될지 확인해 주세요.

---

**검증 결과**: 승인 게이트에서 정확히 멈췄고(실제 git merge/tag/push 명령 미실행), 계획 형식·병합 전
점검(실제 git 조회)·태그 제안·인계 확인 항목까지 정의대로 산출됐다. release-manager 정의는 의도대로
동작한다.

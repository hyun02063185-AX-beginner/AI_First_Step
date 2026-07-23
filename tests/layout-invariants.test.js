/* =========================================================================
   layout-invariants.test.js — 실제 기하(geometry) 검사가 아니라, 정적 CSS 불변식 검사.
   -------------------------------------------------------------------------
   `order/시각검증체계_지시서.md` ③ 산출물. 본래 요구는 "씬 컨테이너의 렌더 폭이 뷰포트의
   일정 비율 이상인지"·"헤더가 뷰포트 상단에 있는지" 같은 실제 렌더 기하 검사였으나, 이
   저장소의 테스트 하네스는 `node --test`(Node 내장, 외부 의존성 0)만 쓴다 — jsdom조차 없고,
   설령 jsdom을 들여와도 jsdom은 CSSOM 파싱만 할 뿐 실제 레이아웃 엔진(box model 계산)이 없어
   `getBoundingClientRect`가 전부 0을 반환한다. 즉 "렌더 폭이 몇 px인지" 같은 검사는 실브라우저
   없이는 원천적으로 불가능하다(Playwright/Puppeteer 도입은 이 하네스의 "의존성 0" 원칙과
   충돌하는 무거운 결정이라 이번 라운드에서는 보류 — 실브라우저 검증은 qa-runner의 시각 검증
   단계로 갈음한다).

   대신 이번에 실제로 터진 버그(연습 책상 레이아웃 붕괴)의 근본 원인 — `.scene` 기본값
   (display:flex)에 대한 `display:block` 오버라이드 누락 — 은 CSS 텍스트만 정적으로 읽어도
   검사할 수 있는 결정론적 불변식이다. 이 파일은 그 불변식만 검사한다. "화면이 실제로 예쁘게
   배치되는가"는 여전히 이 테스트의 범위 밖 — qa-runner의 3뷰포트 스크린샷 검증이 그 몫이다.
   ========================================================================= */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const CSS = fs.readFileSync(path.join(ROOT, "css", "style.css"), "utf8");
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// .pr-top(헤더)+.pr-inner(다단 그리드) 조합의 UI를 호스팅하는 씬 — 이 조합을 쓰는 씬은
// 전부 .scene 기본값(display:flex)을 display:block으로 오버라이드해야 한다. 하나만 있어도
// 이번에 실제로 벌어진 버그(display:flex 형제 배치로 헤더·그리드가 좌우로 갈라짐)가 재발한다.
const PR_LAYOUT_SCENES = ["scene-practice", "scene-desk"];

PR_LAYOUT_SCENES.forEach(id => {
  test(`#${id} — index.html에 씬 섹션이 실제로 존재`, () => {
    const re = new RegExp(`<section\\s+id="${id}"`);
    assert.ok(re.test(HTML), `index.html에 <section id="${id}">가 없음`);
  });

  test(`#${id} — css/style.css에 display:block 오버라이드 존재(.scene 기본 display:flex를 깬다)`, () => {
    const re = new RegExp(`#${id}\\s*\\{[^}]*display\\s*:\\s*block`);
    assert.ok(
      re.test(CSS),
      `css/style.css에 "#${id}{display:block...}" 오버라이드가 없음 — ` +
      `.scene 기본값(display:flex;align-items:center;justify-content:center)이 그대로 적용돼 ` +
      `헤더(.pr-top)와 콘텐츠(.pr-inner)가 플렉스 형제로 좌우 배치되는 회귀가 재발한다.`
    );
  });
});

test(".scene 기본값이 여전히 display:flex인지 확인(전제 자체가 바뀌면 위 검사 의미도 바뀜)", () => {
  const re = /\.scene\{[^}]*display\s*:\s*flex/;
  assert.ok(re.test(CSS), ".scene 기본 display 값이 바뀐 것으로 보임 — 이 파일의 전제를 재검토할 것");
});

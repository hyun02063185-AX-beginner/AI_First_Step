/* =========================================================================
   content-lint.test.js — js/data.js 콘텐츠 무결성 린트
   -------------------------------------------------------------------------
   판단이 필요 없는 결정론적 구조 검사만 한다("규격"인 장수 범위·어투·용어 같은
   판단은 tone-keeper 서브에이전트 몫 — docs/에이전트_운영.md 참고).
   ========================================================================= */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const { CURRICULUM, PRACTICE_MISSIONS } = require(path.join(ROOT, "js", "data.js"));

/* ---------- 사이트별 조정 상수 (여기만 바꾸면 다른 사이트에도 재사용 가능) ---------- */
const LECTURE_COUNT = 20;
const VALID_SLIDE_TYPES = new Set(["cover", "big", "bullets", "quote", "split", "image", "closing"]);
// 마지막 강(가장 큰 id)도 teaser가 필요한지 — 이 사이트는 20강이 AX 과정 티저로 마무리되므로 true.
const LAST_LECTURE_TEASER_REQUIRED = true;

/* ---------- 슬라이드 1장의 타입별 필수 필드 검사 ---------- */
function checkSlideShape(slide, where, errors) {
  if (!slide || typeof slide !== "object") {
    errors.push(`${where}: 슬라이드가 객체가 아님`);
    return;
  }
  if (!VALID_SLIDE_TYPES.has(slide.type)) {
    errors.push(`${where}: 알 수 없는 type "${slide.type}"`);
    return;
  }
  switch (slide.type) {
    case "cover":
      if (!slide.title) errors.push(`${where}: cover.title 없음`);
      break;
    case "big":
      if (!slide.word) errors.push(`${where}: big.word 없음`);
      break;
    case "bullets":
      if (!slide.title) errors.push(`${where}: bullets.title 없음`);
      if (!Array.isArray(slide.items) || slide.items.length === 0)
        errors.push(`${where}: bullets.items가 비어있거나 배열이 아님`);
      break;
    case "quote":
      if (!slide.text) errors.push(`${where}: quote.text 없음`);
      break;
    case "split":
      if (!slide.title) errors.push(`${where}: split.title 없음`);
      if (!Array.isArray(slide.left) || slide.left.length === 0)
        errors.push(`${where}: split.left가 비어있거나 배열이 아님`);
      if (!Array.isArray(slide.right) || slide.right.length === 0)
        errors.push(`${where}: split.right가 비어있거나 배열이 아님`);
      break;
    case "image":
      if (!slide.src) {
        errors.push(`${where}: image.src 없음`);
      } else {
        const imgPath = path.join(ROOT, slide.src);
        if (!fs.existsSync(imgPath)) errors.push(`${where}: image.src 파일 없음 — ${slide.src}`);
      }
      break;
    case "closing":
      if (!slide.title) errors.push(`${where}: closing.title 없음`);
      break;
  }
}

test("CURRICULUM.boxes 안 강의 수 = " + LECTURE_COUNT, () => {
  const total = CURRICULUM.boxes.reduce((n, box) => n + box.lectures.length, 0);
  assert.equal(total, LECTURE_COUNT);
});

test("각 강 id는 1.." + LECTURE_COUNT + " 범위에서 중복 없이 등장", () => {
  const ids = [];
  CURRICULUM.boxes.forEach(box => box.lectures.forEach(lec => ids.push(lec.id)));
  const unique = new Set(ids);
  assert.equal(unique.size, ids.length, "중복 id 존재: " + JSON.stringify(ids));
  for (let i = 1; i <= LECTURE_COUNT; i++) assert.ok(unique.has(i), `id ${i} 누락`);
});

/* ---------- 연습 책상 존① 미션 배열(PRACTICE_MISSIONS) 린트 ---------- */
test("PRACTICE_MISSIONS 배열 존재 · 강의 수와 동일(" + LECTURE_COUNT + "개)", () => {
  assert.ok(Array.isArray(PRACTICE_MISSIONS), "PRACTICE_MISSIONS가 배열이 아님");
  assert.equal(PRACTICE_MISSIONS.length, LECTURE_COUNT);
});

test("PRACTICE_MISSIONS — 각 lectureId는 1.." + LECTURE_COUNT + " 범위에서 중복 없이 등장", () => {
  const ids = PRACTICE_MISSIONS.map(m => m.lectureId);
  const unique = new Set(ids);
  assert.equal(unique.size, ids.length, "중복 lectureId 존재: " + JSON.stringify(ids));
  for (let i = 1; i <= LECTURE_COUNT; i++) assert.ok(unique.has(i), `lectureId ${i} 누락`);
});

test("PRACTICE_MISSIONS — boxIndex가 CURRICULUM.boxes 범위 안 · text 비어있지 않음", () => {
  const errors = [];
  PRACTICE_MISSIONS.forEach((m, i) => {
    if (!Number.isInteger(m.boxIndex) || m.boxIndex < 0 || m.boxIndex >= CURRICULUM.boxes.length)
      errors.push(`PRACTICE_MISSIONS[${i}](lectureId ${m.lectureId}): boxIndex ${m.boxIndex}가 범위(0..${CURRICULUM.boxes.length - 1}) 밖`);
    if (!m.text || typeof m.text !== "string" || !m.text.trim())
      errors.push(`PRACTICE_MISSIONS[${i}](lectureId ${m.lectureId}): text 없음`);
  });
  assert.deepEqual(errors, [], errors.join("\n"));
});

test("PRACTICE_MISSIONS — boxIndex가 실제 CURRICULUM 상자 배치 순서와 일치", () => {
  // lectureId → 실제 CURRICULUM에서의 상자 인덱스를 역산해 대조(상자 구성이 바뀌어도 늘 정합하도록)
  const boxOf = {};
  CURRICULUM.boxes.forEach((box, bi) => box.lectures.forEach(lec => { boxOf[lec.id] = bi; }));
  const errors = [];
  PRACTICE_MISSIONS.forEach(m => {
    if (boxOf[m.lectureId] !== m.boxIndex)
      errors.push(`lectureId ${m.lectureId}: PRACTICE_MISSIONS.boxIndex=${m.boxIndex} vs 실제=${boxOf[m.lectureId]}`);
  });
  assert.deepEqual(errors, [], errors.join("\n"));
});

CURRICULUM.boxes.forEach((box, bi) => {
  box.lectures.forEach(lec => {
    const label = `구역${bi + 1}·${lec.id}강(${lec.title})`;

    test(`${label} — slides 비어있지 않음`, () => {
      assert.ok(Array.isArray(lec.slides) && lec.slides.length > 0, `${label}: slides 없음/빈 배열`);
    });

    test(`${label} — 첫 슬라이드=cover, 마지막=closing`, () => {
      assert.equal(lec.slides[0].type, "cover", `${label}: 첫 슬라이드가 cover 아님`);
      assert.equal(lec.slides[lec.slides.length - 1].type, "closing", `${label}: 마지막 슬라이드가 closing 아님`);
    });

    test(`${label} — 슬라이드 타입·필수 필드 유효`, () => {
      const errors = [];
      lec.slides.forEach((s, i) => checkSlideShape(s, `${label} #${i}`, errors));
      assert.deepEqual(errors, [], errors.join("\n"));
    });

    test(`${label} — closing.teaser 존재`, () => {
      const closing = lec.slides[lec.slides.length - 1];
      const isLastLecture = lec.id === LECTURE_COUNT;
      if (isLastLecture && !LAST_LECTURE_TEASER_REQUIRED) return; // 사이트별 예외
      assert.ok(closing.teaser && closing.teaser.trim().length > 0, `${label}: closing.teaser 없음`);
    });

    test(`${label} — slidesVariants(있으면) 유효`, () => {
      if (!lec.slidesVariants) return;
      const errors = [];
      Object.entries(lec.slidesVariants).forEach(([personaKey, overrideMap]) => {
        Object.entries(overrideMap).forEach(([idxStr, overrideSlide]) => {
          const idx = Number(idxStr);
          if (!Number.isInteger(idx) || idx < 0 || idx >= lec.slides.length) {
            errors.push(`${label}: slidesVariants.${personaKey}의 인덱스 ${idxStr}가 기본판 범위(0..${lec.slides.length - 1}) 밖`);
            return;
          }
          checkSlideShape(overrideSlide, `${label}: slidesVariants.${personaKey}[${idx}]`, errors);
        });
      });
      assert.deepEqual(errors, [], errors.join("\n"));
    });
  });
});

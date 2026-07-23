/* =========================================================================
   desk.js — 연습 책상 (AI 첫걸음 실습 공간)
   -------------------------------------------------------------------------
   · 앱이 AI를 대신하지 않는다 — 모든 실습은 수강생 "자기 챗봇"에서 하고,
     앱은 안내·조립·기록만 맡는다(외부 AI 호출 없음, API 비용 0).
   · 3존: ① 미션 스탬프판 ② 프롬프트 조립대 ③ 나의 시작 키트
   · Lv1부터 상시 노출(게이팅 없음) — `SITE_CONFIG.practiceDesk`로 제어.
   · 라우터가 #/desk 에서 openDesk() 호출.
   ========================================================================= */
(function () {
  "use strict";
  const scene = document.getElementById("scene-desk");
  if (!scene) return;

  const STAMP_KEY = "desk_stamps";     // 완료 미션 lectureId 배열
  const KIT_KEY = "desk_kit";          // { chatbot, prompts:[...], rules:[...] }

  function loadStamps() { try { const a = JSON.parse(localStorage.getItem(STAMP_KEY)); return new Set(Array.isArray(a) ? a : []); } catch (e) { return new Set(); } }
  function loadKit() {
    try {
      const v = JSON.parse(localStorage.getItem(KIT_KEY)) || {};
      return { chatbot: v.chatbot || "", prompts: Array.isArray(v.prompts) ? v.prompts : [], rules: Array.isArray(v.rules) ? v.rules : [] };
    } catch (e) { return { chatbot: "", prompts: [], rules: [] }; }
  }
  let stamps = loadStamps(), kit = loadKit();
  const saveStamps = () => { try { localStorage.setItem(STAMP_KEY, JSON.stringify([...stamps])); } catch (e) {} };
  const saveKit = () => { try { localStorage.setItem(KIT_KEY, JSON.stringify(kit)); } catch (e) {} };

  const esc = t => String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const TOTAL_MISSIONS = (typeof PRACTICE_MISSIONS !== "undefined" ? PRACTICE_MISSIONS.length : 20);

  function kitFilledFields() {
    const f = [];
    if (kit.chatbot && kit.chatbot.trim()) f.push("chatbot");
    if (kit.prompts.length) f.push("prompts");
    if (kit.rules.length) f.push("rules");
    return f;
  }
  function notifyKit() { window.Telemetry && Telemetry.kitUpdated(kitFilledFields(), stamps.size); }

  /* =====================================================================
     탭(존) 전환
     ===================================================================== */
  const ZONES = [
    { k: "stamps", t: "미션 스탬프판", ic: "📋" },
    { k: "build", t: "프롬프트 조립대", ic: "🧩" },
    { k: "kit", t: "나의 시작 키트", ic: "🎒" }
  ];
  let activeZone = "stamps";

  function render() {
    scene.innerHTML = `
      <header class="pr-top">
        <button class="pr-exit" id="desk-exit">← 입장 화면</button>
        <span class="pr-title">연습 책상 <span class="pr-title__sub">배운 걸 내 챗봇에서 연습한다</span></span>
        <span class="pr-progress">미션 <b>${stamps.size}</b>/${TOTAL_MISSIONS}</span>
      </header>
      <div class="pr-inner">
        <div class="pr-floors desk-tabs">${ZONES.map(zoneTab).join("")}</div>
        <div class="pr-stage" id="desk-stage">${zoneView(activeZone)}</div>
      </div>`;
    document.getElementById("desk-exit").addEventListener("click", () => App.Router.go("start"));
    scene.querySelectorAll(".pr-floor-tab").forEach(t => t.addEventListener("click", () => { activeZone = t.dataset.zone; refreshStage(); }));
    bindZone();
  }
  function refreshStage() {
    const st = document.getElementById("desk-stage"); if (st) st.innerHTML = zoneView(activeZone);
    scene.querySelectorAll(".pr-floor-tab").forEach(t => t.classList.toggle("active", t.dataset.zone === activeZone));
    const prog = scene.querySelector(".pr-progress"); if (prog) prog.innerHTML = `미션 <b>${stamps.size}</b>/${TOTAL_MISSIONS}`;
    bindZone();
  }
  function zoneTab(z) {
    return `<button class="pr-floor-tab ${z.k === activeZone ? "active" : ""}" data-zone="${z.k}">
      <span class="pr-floor-n">${z.ic}</span><span class="pr-floor-t">${esc(z.t)}</span>
    </button>`;
  }
  function zoneView(k) { return k === "stamps" ? stampsView() : k === "build" ? buildView() : kitView(); }
  function bindZone() {
    if (activeZone === "stamps") bindStamps();
    else if (activeZone === "build") bindBuild();
    else bindKit();
  }

  /* =====================================================================
     존① 미션 스탬프판
     ===================================================================== */
  function stampsView() {
    const boxes = CURRICULUM.boxes, missions = (typeof PRACTICE_MISSIONS !== "undefined" ? PRACTICE_MISSIONS : []);
    const groups = boxes.map((box, bi) => {
      const rows = missions.filter(m => m.boxIndex === bi);
      if (!rows.length) return "";
      return `<div class="desk-group" style="--group-accent:${box.accent}">
        <p class="desk-group__t">${esc(box.name)}</p>
        <div class="pr-cards desk-cards">${rows.map(missionCard).join("")}</div>
      </div>`;
    }).join("");
    return `<p class="pr-floor-head">📋 미션 스탬프판 <span>20개 과제를 내 챗봇에서 해보고 스탬프를 찍어요</span></p>${groups}`;
  }
  function missionCard(m) {
    const d = stamps.has(m.lectureId);
    return `<div class="pr-card desk-mission ${d ? "done" : ""}">
      <span class="pr-card-body">
        <button type="button" class="desk-lec-link" data-goto="${m.lectureId}">${String(m.lectureId).padStart(2, "0")}강에서 배웠어요</button>
        <span class="pr-card-tag">${esc(m.text)}</span>
      </span>
      <button type="button" class="desk-stamp-btn ${d ? "on" : ""}" data-stamp="${m.lectureId}">${d ? "완료 ✓" : "완료 스탬프"}</button>
    </div>`;
  }
  function bindStamps() {
    scene.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => App.Router.go("lecture/" + b.dataset.goto)));
    scene.querySelectorAll("[data-stamp]").forEach(b => b.addEventListener("click", () => {
      const id = +b.dataset.stamp;
      if (stamps.has(id)) stamps.delete(id);
      else { stamps.add(id); window.Telemetry && Telemetry.missionStamp(id); }
      saveStamps(); refreshStage();
    }));
  }

  /* =====================================================================
     존② 프롬프트 조립대 (07강 "재료 세 가지" 실습)
     ===================================================================== */
  const PRESETS = [
    { label: "메일 다듬기(11강)", sit: "미뤄둔 메일 답장을 써야 하는데", aud: "거래처 담당자에게", shape: "정중한 존댓말로, 3문단 이내" },
    { label: "요약 요청(12강)", sit: "긴 회의록을 받았는데 핵심만 알고 싶어요", aud: "나 혼자 보려고", shape: "핵심 3줄 요약으로" },
    { label: "아이디어 벽치기(13강)", sit: "다음 회의 전에 예상 질문을 준비해야 하는데", aud: "팀 회의에서 쓰려고", shape: "예상 질문 10개 리스트로" }
  ];
  function assembleText(sit, aud, shape) {
    const s = (sit || "").trim(), a = (aud || "").trim(), f = (shape || "").trim();
    if (!s && !a && !f) return "";
    const parts = [];
    if (s) parts.push(s);
    if (a) parts.push(a + " 전달할 내용이에요");
    if (f) parts.push("형식은 " + f);
    return parts.join(". ") + ".";
  }
  function buildView() {
    return `<p class="pr-floor-head">🧩 프롬프트 조립대 <span>재료 세 가지(07강)를 채우면 프롬프트가 조립돼요</span></p>
      <div class="desk-presets">${PRESETS.map((p, i) => `<button type="button" class="desk-preset" data-preset="${i}">${esc(p.label)}</button>`).join("")}</div>
      <div class="pr-field"><label>상황</label><input class="pr-input pr-input--edit" id="bd-sit" placeholder="예: 거래처에 납기 연장을 부탁해야 하는데"></div>
      <div class="pr-field"><label>대상</label><input class="pr-input pr-input--edit" id="bd-aud" placeholder="예: 10년 거래한 부장님께"></div>
      <div class="pr-field"><label>원하는 모양</label><input class="pr-input pr-input--edit" id="bd-shape" placeholder="예: 정중하지만 짧게, 5문장 안으로"></div>
      <div class="desk-assembled" id="bd-out"><p class="axp-empty">세 칸을 채우면 여기에 완성 프롬프트가 조립돼요</p></div>
      <div class="pr-btnrow"><button type="button" class="pr-run" id="bd-copy" disabled>📋 복사</button><button type="button" class="pr-run pr-run--good" id="bd-save" disabled>🎒 내 키트에 저장</button></div>
      <p class="desk-hint">복사해서 내 챗봇에 붙여넣어 보세요 — 앱은 여기까지, 실행은 자기 챗봇에서.</p>`;
  }
  function bindBuild() {
    const sit = scene.querySelector("#bd-sit"), aud = scene.querySelector("#bd-aud"), shape = scene.querySelector("#bd-shape");
    const out = scene.querySelector("#bd-out"), copyBtn = scene.querySelector("#bd-copy"), saveBtn = scene.querySelector("#bd-save");
    function current() { return assembleText(sit.value, aud.value, shape.value); }
    function refresh() {
      const txt = current();
      out.innerHTML = txt ? `<p>${esc(txt)}</p>` : `<p class="axp-empty">세 칸을 채우면 여기에 완성 프롬프트가 조립돼요</p>`;
      copyBtn.disabled = !txt; saveBtn.disabled = !txt;
    }
    [sit, aud, shape].forEach(i => i.addEventListener("input", refresh));
    scene.querySelectorAll("[data-preset]").forEach(b => b.addEventListener("click", () => {
      const p = PRESETS[+b.dataset.preset]; sit.value = p.sit; aud.value = p.aud; shape.value = p.shape; refresh();
    }));
    copyBtn.addEventListener("click", () => {
      try { navigator.clipboard.writeText(current()); } catch (e) {}
      const o = copyBtn.textContent; copyBtn.textContent = "복사됨 ✓"; setTimeout(() => copyBtn.textContent = o, 1200);
    });
    saveBtn.addEventListener("click", () => {
      const txt = current(); if (!txt) return;
      kit.prompts.push(txt); saveKit(); notifyKit();
      const o = saveBtn.textContent; saveBtn.textContent = "저장됨 ✓"; setTimeout(() => saveBtn.textContent = o, 1200);
    });
    refresh();
  }

  /* =====================================================================
     존③ 나의 시작 키트 (수료 산출물)
     ===================================================================== */
  function promptRow(p, i) { return `<div class="desk-row"><span>${esc(p)}</span><button type="button" class="desk-row-del" data-del-prompt="${i}">✕</button></div>`; }
  function ruleRow(r, i) { return `<div class="desk-row"><span>${esc(r)}</span><button type="button" class="desk-row-del" data-del-rule="${i}">✕</button></div>`; }
  function kitView() {
    return `<p class="pr-floor-head">🎒 나의 시작 키트 <span>19·20강의 "메모장"을 카드 한 장으로</span></p>
      <div class="desk-kit-edit">
        <div class="pr-field"><label>나의 단짝 챗봇 <span class="desk-hint">(10강)</span></label>
          <input class="pr-input pr-input--edit" id="kit-chatbot" placeholder="예: ChatGPT" value="${esc(kit.chatbot)}"></div>
        <div class="pr-field"><label>나의 프롬프트 모음 <span class="desk-hint">(프롬프트 조립대에서 저장하거나 직접 추가)</span></label>
          <div class="desk-list">${kit.prompts.map(promptRow).join("") || '<p class="axp-empty">아직 저장한 프롬프트가 없어요</p>'}</div>
          <div class="desk-addrow"><input class="pr-input pr-input--edit" id="kit-prompt-add" placeholder="직접 추가"><button type="button" class="pr-run" id="kit-prompt-addbtn">+ 추가</button></div></div>
        <div class="pr-field"><label>나의 신호등 규칙 <span class="desk-hint">(16강 — 지울 것 목록)</span></label>
          <div class="desk-list">${kit.rules.map(ruleRow).join("") || '<p class="axp-empty">아직 규칙이 없어요</p>'}</div>
          <div class="desk-addrow"><input class="pr-input pr-input--edit" id="kit-rule-add" placeholder="예: 고객 이름·금액은 지운다"><button type="button" class="pr-run" id="kit-rule-addbtn">+ 추가</button></div></div>
      </div>
      <div class="axp-proposal desk-kit-preview">${kitCardHTML()}</div>
      <div class="pr-btnrow"><button type="button" class="pr-run pr-run--good" id="kit-export">🎒 미리보기 · 내보내기</button></div>`;
  }
  function bindKit() {
    const chat = scene.querySelector("#kit-chatbot");
    chat.addEventListener("input", () => { kit.chatbot = chat.value; saveKit(); });
    chat.addEventListener("change", () => { notifyKit(); refreshStage(); });
    scene.querySelectorAll("[data-del-prompt]").forEach(b => b.addEventListener("click", () => { kit.prompts.splice(+b.dataset.delPrompt, 1); saveKit(); refreshStage(); }));
    scene.querySelectorAll("[data-del-rule]").forEach(b => b.addEventListener("click", () => { kit.rules.splice(+b.dataset.delRule, 1); saveKit(); refreshStage(); }));
    const pAdd = scene.querySelector("#kit-prompt-add"), pBtn = scene.querySelector("#kit-prompt-addbtn");
    pBtn.addEventListener("click", () => { const v = pAdd.value.trim(); if (!v) return; kit.prompts.push(v); saveKit(); notifyKit(); refreshStage(); });
    pAdd.addEventListener("keydown", e => { if (e.key === "Enter") pBtn.click(); });
    const rAdd = scene.querySelector("#kit-rule-add"), rBtn = scene.querySelector("#kit-rule-addbtn");
    rBtn.addEventListener("click", () => { const v = rAdd.value.trim(); if (!v) return; kit.rules.push(v); saveKit(); notifyKit(); refreshStage(); });
    rAdd.addEventListener("keydown", e => { if (e.key === "Enter") rBtn.click(); });
    scene.querySelector("#kit-export").addEventListener("click", openExport);
  }
  function kitCardHTML() {
    const slot = (label, html) => `<div class="axp-slot"><h4>${label}</h4>${html || '<p class="axp-empty">아직 작성 전</p>'}</div>`;
    const chatHtml = kit.chatbot ? `<p>${esc(kit.chatbot)}</p>` : "";
    const promptsHtml = kit.prompts.length ? `<ul>${kit.prompts.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : "";
    const rulesHtml = kit.rules.length ? `<ul>${kit.rules.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : "";
    return `<div class="axp-prop-head"><h3>나의 시작 키트</h3><p class="axp-dim">${esc(SITE_CONFIG.finalMessage)}</p></div>
      <div class="axp-prop-grid">
        ${slot("💬 나의 단짝 챗봇", chatHtml)}
        ${slot("🧩 나의 프롬프트 모음", promptsHtml)}
        ${slot("🚦 나의 신호등 규칙", rulesHtml)}
        ${slot("📋 미션 진행", `<p class="axp-big-n">${stamps.size} / ${TOTAL_MISSIONS}</p>`)}
      </div>`;
  }
  function kitCardText() {
    const L = ["[나의 시작 키트 · AI 첫걸음]", ""];
    L.push("■ 단짝 챗봇: " + (kit.chatbot || "-"));
    L.push("■ 프롬프트 모음: " + (kit.prompts.length ? kit.prompts.join(" / ") : "-"));
    L.push("■ 신호등 규칙: " + (kit.rules.length ? kit.rules.join(" / ") : "-"));
    L.push("■ 미션 진행: " + stamps.size + "/" + TOTAL_MISSIONS);
    L.push("", SITE_CONFIG.finalMessage + ".");
    return L.join("\n");
  }

  /* ---------- 내보내기 패널 (진단실 제안서와 동일 방식: 복사 + 브라우저 네이티브 인쇄) ---------- */
  const exportPanel = document.createElement("div");
  exportPanel.className = "pr-panel"; exportPanel.id = "desk-export"; exportPanel.hidden = true;
  exportPanel.innerHTML = '<div class="pr-panel__box"><button class="pr-panel__x" id="desk-export-x">✕</button><div class="pr-panel__inner" id="desk-export-inner"></div></div>';
  document.body.appendChild(exportPanel);
  exportPanel.querySelector("#desk-export-x").addEventListener("click", closeExport);
  exportPanel.addEventListener("click", e => { if (e.target === exportPanel) closeExport(); });
  document.addEventListener("keydown", e => { if (!exportPanel.hidden && e.key === "Escape") closeExport(); });
  function openExport() {
    exportPanel.querySelector("#desk-export-inner").innerHTML =
      '<div class="pr-btnrow"><button type="button" class="pr-run" id="desk-copy">📋 텍스트 복사</button><button type="button" class="pr-run" id="desk-print">🖨️ 인쇄</button></div>' +
      '<div class="axp-proposal">' + kitCardHTML() + '</div>';
    exportPanel.hidden = false; void exportPanel.offsetWidth; exportPanel.classList.add("show");
    exportPanel.querySelector("#desk-copy").addEventListener("click", () => {
      try { navigator.clipboard.writeText(kitCardText()); } catch (e) {}
      const b = exportPanel.querySelector("#desk-copy"), o = b.textContent; b.textContent = "복사됨 ✓"; setTimeout(() => b.textContent = o, 1400);
    });
    exportPanel.querySelector("#desk-print").addEventListener("click", () => {
      document.body.classList.add("axp-printing"); window.print();
      setTimeout(() => document.body.classList.remove("axp-printing"), 500);
    });
  }
  function closeExport() { exportPanel.classList.remove("show"); setTimeout(() => { exportPanel.hidden = true; }, 240); }

  /* =====================================================================
     진입점 · #/reset 연동
     ===================================================================== */
  function openDesk() { stamps = loadStamps(); kit = loadKit(); activeZone = "stamps"; render(); }
  window.openDesk = openDesk;

  function resetAll() { stamps = new Set(); kit = { chatbot: "", prompts: [], rules: [] }; saveStamps(); saveKit(); }
  window.Desk = { reset: resetAll };

  // 입장 화면 버튼 — 진단실과 달리 게이팅 없이 Lv1부터 상시 노출(해금 연출 불필요).
  function initDeskDoor() {
    const door = document.getElementById("desk-door"); if (!door) return;
    if (SITE_CONFIG.practiceDesk !== true) { door.hidden = true; return; }
    door.hidden = false;
    if (!door.dataset.bound) { door.dataset.bound = "1"; door.addEventListener("click", () => App.Router.go("desk")); }
  }
  document.addEventListener("DOMContentLoaded", initDeskDoor);
  window.refreshDeskDoor = initDeskDoor;
})();

/* =========================================================================
   site-config.js — 이 사이트를 정의하는 단 하나의 파일
   -------------------------------------------------------------------------
   본진(Last_Lecture, "사유의 방")을 복제해 만든 사이트: 「첫 출근」(AI 첫걸음 20강).
   docs/엔진_경계.md 참고. CURRICULUM(data.js)과 같은 방식으로 최상단
   const 선언 — 다른 스크립트에서 SITE_CONFIG로 바로 참조한다.

   본진 대비 추가된 키(rankTitles·completionTitle·completionTitleMastered·
   skinGating·boxLabel)는 main.js/room.js가 "값이 있으면 쓰고 없으면 본진
   기본값" 방식으로 읽도록 만들어졌다 — 본진 site-config.js에는 아직 없어도 안전하다.
   (이식 대상 — order/AI첫걸음_사이트생성_지시서.md 검증 보고 참고)
   ========================================================================= */
const SITE_CONFIG = {
  course: "aifirst",                 // LMS 과정 식별자 — 본진과 같은 Supabase, course로만 구분

  siteName: "첫 출근",
  siteSubtitle: "AI 첫걸음 20강",
  courseLabel: "첫걸음",

  kicker: "AI FIRST STEP · {N}강",
  tagline: "오늘, 사무실에서 AI와 첫 인사를 나누는 {N}강",
  enterHint: "클릭하여 첫 출근을 시작합니다",

  defaultSkin: "office",
  availableSkins: ["office", "paper", "neon"],   // 3종으로 슬림
  skinGating: false,                 // 입문 과정 — Lv로 스킨을 잠그지 않는다(처음부터 3종 전부)

  introThemes: ["snow", "sakura"],   // 차분한 2종만(별똥별·불꽃놀이 제외)

  fxLevel: "calm",                   // 워프·폭죽·상자 등장연출을 페이드로(톤: 밝음·연출 절제)
  practiceRoom: false,               // 진단실 없음 — 입장 화면·라우트에서 완전히 숨김

  finalMessage: "오늘 배운 것을, 내일 책상에서",
  boxLabel: "구역",                  // 상자 라벨 대체(본진 기본값 "상자") — room.js가 fallback으로 읽는다

  // Lv1~5 칭호 — 본진 기본값(Wanderer...) 대신 온보딩 서사로.
  rankTitles: ["", "인턴", "신입", "주임", "선임", "에이스"],
  // 20강 완주 축하 오버레이 문구(본진 기본 "훌륭히 완주하셨습니다." 대신)
  completionTitle: "첫 출근을 마쳤습니다.",
  completionTitleMastered: "이제 이 사무실의 에이스입니다.",

  // 페르소나 레지스트리 — ?variant=<키>로 전환(main.js가 파싱, slides.js가 합성).
  // default는 URL에 안 붙는 상태(기본판=직장인). badge=HUD에 표시할 한 글자(없으면 뱃지 없음).
  // docs/페르소나_작성_가이드.md 참고 — 이식 대상(order/페르소나_variant_기반_지시서.md §⑥).
  personas: {
    default: { label: "직장인", badge: null },
    student: { label: "대학생", badge: "S" },
    owner:   { label: "자영업", badge: "O" }
  }
};

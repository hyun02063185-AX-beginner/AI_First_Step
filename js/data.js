/* =========================================================================
   data.js — 커리큘럼 데이터 (구역 4개 · 강의 20개 · 슬라이드)
   -------------------------------------------------------------------------
   ★ 현재는 골격(skeleton) 단계 — 각 강 cover+closing 2장 placeholder만.
   본문 슬라이드는 후속 지시서에서 구역 단위로 채운다.
   슬라이드 타입:
     { type: "cover",   kicker, title, subtitle }
     { type: "big",     word, sub }                 // 대형 키워드 1개
     { type: "bullets", title, subtitle, items:[] } // 소제목 + 항목
     { type: "quote",   text, by }                  // 인용/한마디
     { type: "split",   title, left:[], right:[] }  // 좌우 비교
     { type: "image",   title, src, caption }       // 이미지 (assets/에 넣기)
     { type: "closing", title, teaser }             // 마무리 + 다음 강 티저
   ========================================================================= */

const CURRICULUM = {
  title: "AI 첫걸음",
  subtitle: "첫 출근 · 20강 온보딩 여정",
  boxes: [
    {
      id: "lobby",
      name: "🏢 로비",
      theme: "정체 — AI가 뭔데",
      accent: "#0E7490",
      lectures: [
        {
          id: 1, title: "AI는 이미 곁에 있다", tagline: "출퇴근길과 사무실 속 AI 찾기",
          slides: [
            { type: 'cover', kicker: '로비 · 01', title: 'AI는 이미 곁에 있다', subtitle: '출퇴근길과 사무실 속 AI 찾기' },
            { type: 'closing', title: '생각보다 가까이 있었다', teaser: '그럼 이 AI는 대체 어떻게 똑똑해진 걸까? (다음 강: AI는 어떻게 배우는가)' }
          ]
        },
        {
          id: 2, title: "AI는 어떻게 배우는가", tagline: '데이터와 패턴, "많이 보면 감이 온다"',
          slides: [
            { type: 'cover', kicker: '로비 · 02', title: 'AI는 어떻게 배우는가', subtitle: '데이터와 패턴, "많이 보면 감이 온다"' },
            { type: 'closing', title: '많이 보면 감이 온다', teaser: '그렇게 배운 AI가, 대화할 땐 정확히 뭘 하는 걸까? (다음 강: 생성형 AI의 정체)' }
          ]
        },
        {
          id: 3, title: "생성형 AI의 정체", tagline: '"그럴듯한 다음"을 만드는 기계',
          slides: [
            { type: 'cover', kicker: '로비 · 03', title: '생성형 AI의 정체', subtitle: '"그럴듯한 다음"을 만드는 기계' },
            { type: 'closing', title: '그럴듯한 다음을 만든다', teaser: '그렇다면 잘하는 일과 못하는 일은 어떻게 나뉠까? (다음 강: 잘하는 것, 못하는 것)' }
          ]
        },
        {
          id: 4, title: "잘하는 것, 못하는 것", tagline: "능력의 지도",
          slides: [
            { type: 'cover', kicker: '로비 · 04', title: '잘하는 것, 못하는 것', subtitle: '능력의 지도' },
            { type: 'closing', title: '능력의 지도를 그렸다', teaser: '로비 마지막 관문 — 이것만 알면 대화를 시작할 수 있다. (다음 강: 딱 10개만 알면 되는 용어)' }
          ]
        },
        {
          id: 5, title: "딱 10개만 알면 되는 용어", tagline: "이 정도면 대화할 준비 끝",
          slides: [
            { type: 'cover', kicker: '로비 · 05', title: '딱 10개만 알면 되는 용어', subtitle: '이 정도면 대화할 준비 끝' },
            { type: 'closing', title: '로비 투어 완료', teaser: '정체를 알았으니, 이제 첫 인사를 나눌 차례. (다음 구역: 💬 미팅룸)' }
          ]
        }
      ]
    },
    {
      id: "meeting",
      name: "💬 미팅룸",
      theme: "만남 — 처음 말 걸기",
      accent: "#7C3AED",
      lectures: [
        {
          id: 6, title: "첫 대화 시작하기", tagline: "화면 열고 아무거나 물어보기",
          slides: [
            { type: 'cover', kicker: '미팅룸 · 06', title: '첫 대화 시작하기', subtitle: '화면 열고 아무거나 물어보기' },
            { type: 'closing', title: '첫 인사를 나눴다', teaser: '그런데 뭘 물어야 원하는 답이 나올까? (다음 강: 질문 잘하는 법, 아주 기초)' }
          ]
        },
        {
          id: 7, title: "질문 잘하는 법, 아주 기초", tagline: "구체적으로가 전부",
          slides: [
            { type: 'cover', kicker: '미팅룸 · 07', title: '질문 잘하는 법, 아주 기초', subtitle: '구체적으로가 전부' },
            { type: 'closing', title: '구체적으로가 전부다', teaser: '한 번에 원하는 답이 안 나오면? (다음 강: 대화는 이어가는 것)' }
          ]
        },
        {
          id: 8, title: "대화는 이어가는 것", tagline: '한 번에 안 되면 "더 짧게"',
          slides: [
            { type: 'cover', kicker: '미팅룸 · 08', title: '대화는 이어가는 것', subtitle: '한 번에 안 되면 "더 짧게"' },
            { type: 'closing', title: '한 번에 안 되면 이어가면 된다', teaser: '그런데 이 대화 상대, 가끔 틀린 말도 한다는데? (다음 강: AI도 틀린다)' }
          ]
        },
        {
          id: 9, title: "AI도 틀린다", tagline: "그럴듯한 오답 알아보기",
          slides: [
            { type: 'cover', kicker: '미팅룸 · 09', title: 'AI도 틀린다', subtitle: '그럴듯한 오답 알아보기' },
            { type: 'closing', title: '그럴듯한 오답을 가려낼 줄 안다', teaser: '미팅룸 마지막 — 나에게 맞는 대화 상대는 누굴까? (다음 강: 나에게 맞는 AI 고르기)' }
          ]
        },
        {
          id: 10, title: "나에게 맞는 AI 고르기", tagline: "내 자리에 맞는 도구 고르기",
          slides: [
            { type: 'cover', kicker: '미팅룸 · 10', title: '나에게 맞는 AI 고르기', subtitle: '내 자리에 맞는 도구 고르기' },
            { type: 'closing', title: '미팅룸 투어 완료', teaser: '이제 인사는 끝났다. 내 책상에 앉아 실제로 써볼 차례. (다음 구역: 💻 내 책상)' }
          ]
        }
      ]
    },
    {
      id: "desk",
      name: "💻 내 책상",
      theme: "책상 — 일에 얹기",
      accent: "#DB2777",
      lectures: [
        {
          id: 11, title: "메일·메시지 문장 다듬기", tagline: "첫 실전, 메일부터",
          slides: [
            { type: 'cover', kicker: '내 책상 · 11', title: '메일·메시지 문장 다듬기', subtitle: '첫 실전, 메일부터' },
            { type: 'closing', title: '메일 한 통이 달라졌다', teaser: '문장 다음은 — 긴 글을 짧게 만드는 마법. (다음 강: 요약의 마법)' }
          ]
        },
        {
          id: 12, title: "요약의 마법", tagline: "회의록·긴 자료",
          slides: [
            { type: 'cover', kicker: '내 책상 · 12', title: '요약의 마법', subtitle: '회의록·긴 자료' },
            { type: 'closing', title: '긴 자료가 짧아졌다', teaser: '그럼 반대로, 없던 아이디어를 만들어낼 땐? (다음 강: 아이디어 벽치기)' }
          ]
        },
        {
          id: 13, title: "아이디어 벽치기", tagline: "기획이 막막할 때",
          slides: [
            { type: 'cover', kicker: '내 책상 · 13', title: '아이디어 벽치기', subtitle: '기획이 막막할 때' },
            { type: 'closing', title: '막막함에 첫 줄이 생겼다', teaser: '다음은 말투 — 같은 내용도 다르게 전하는 법. (다음 강: 번역과 말투 바꾸기)' }
          ]
        },
        {
          id: 14, title: "번역과 말투 바꾸기", tagline: "비즈니스 톤",
          slides: [
            { type: 'cover', kicker: '내 책상 · 14', title: '번역과 말투 바꾸기', subtitle: '비즈니스 톤' },
            { type: 'closing', title: '톤을 자유롭게 바꿀 수 있다', teaser: '내 책상 마지막 — 검색창과는 뭐가 다를까? (다음 강: 검색과 AI는 다르다)' }
          ]
        },
        {
          id: 15, title: "검색과 AI는 다르다", tagline: "언제 뭘 쓰나",
          slides: [
            { type: 'cover', kicker: '내 책상 · 15', title: '검색과 AI는 다르다', subtitle: '언제 뭘 쓰나' },
            { type: 'closing', title: '내 책상 투어 완료', teaser: '일에 얹는 법을 익혔다. 이제 오래, 안전하게 쓰는 자세를 배울 차례. (다음 구역: 🔐 보안 게이트)' }
          ]
        }
      ]
    },
    {
      id: "gate",
      name: "🔐 보안 게이트",
      theme: "자세 — 현명하게 오래",
      accent: "#047857",
      lectures: [
        {
          id: 16, title: "넣으면 안 되는 것들", tagline: "개인정보 기초",
          slides: [
            { type: 'cover', kicker: '보안 게이트 · 16', title: '넣으면 안 되는 것들', subtitle: '개인정보 기초' },
            { type: 'closing', title: '넣지 말아야 할 것을 안다', teaser: '그럼 AI가 만든 결과물은 누구 것일까? (다음 강: AI 결과물, 내 것일까)' }
          ]
        },
        {
          id: 17, title: "AI 결과물, 내 것일까", tagline: "저작권 상식",
          slides: [
            { type: 'cover', kicker: '보안 게이트 · 17', title: 'AI 결과물, 내 것일까', subtitle: '저작권 상식' },
            { type: 'closing', title: '저작권 상식을 갖췄다', teaser: '떠도는 AI 괴담, 어디까지가 진짜일까? (다음 강: AI 괴담과 진실)' }
          ]
        },
        {
          id: 18, title: "AI 괴담과 진실", tagline: "과장과 사실 구분",
          slides: [
            { type: 'cover', kicker: '보안 게이트 · 18', title: 'AI 괴담과 진실', subtitle: '과장과 사실 구분' },
            { type: 'closing', title: '과장과 사실을 가려냈다', teaser: '도구는 계속 바뀐다. 그럼 뭘 남겨야 할까? (다음 강: 계속 배우는 법)' }
          ]
        },
        {
          id: 19, title: "계속 배우는 법", tagline: "도구는 바뀌어도 남는 것",
          slides: [
            { type: 'cover', kicker: '보안 게이트 · 19', title: '계속 배우는 법', subtitle: '도구는 바뀌어도 남는 것' },
            { type: 'closing', title: '남는 것은 태도다', teaser: '드디어 마지막 강 — 첫 출근을 마치며. (다음 강: 다음 여정)' }
          ]
        },
        {
          id: 20, title: "다음 여정", tagline: "일하는 방식을 바꾸다",
          slides: [
            { type: 'cover', kicker: '보안 게이트 · 20 · 마지막', title: '다음 여정', subtitle: '일하는 방식을 바꾸다' },
            { type: 'closing', title: '첫 출근을 마쳤습니다', teaser: '내일부터는 진짜 업무 — 그리고 더 깊이 들어갈 준비가 됐다면, AX 실무 입문 20강이 기다리고 있습니다.' }
          ]
        }
      ]
    }
  ]
};

/* 아직 PPT를 안 넣은 강의용 기본 슬라이드 골격.
   실제 내용으로 교체하거나, 위처럼 배열을 직접 작성하세요. */
function placeholderDeck(num, title, subtitle) {
  const n = String(num).padStart(2, "0");
  return [
    { type: "cover", kicker: `${n}강`, title: title, subtitle: subtitle },
    { type: "big", word: "여기에\n핵심 키워드", sub: "PPT의 첫 메시지를 대형 키워드로" },
    { type: "bullets", title: "핵심 포인트", subtitle: "PPT 내용을 여기에", items: [
      "여기에 첫 번째 요점을 입력하세요",
      "여기에 두 번째 요점을 입력하세요",
      "여기에 세 번째 요점을 입력하세요"
    ]},
    { type: "quote", text: "\"이 강의의 한 문장 메시지를 여기에.\"", by: title },
    { type: "closing", title: "정리 한 줄", teaser: "다음 강의를 향한 티저 문장을 여기에" }
  ];
}

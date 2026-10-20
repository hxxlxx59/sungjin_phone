'use client';

import React, { useState, useEffect } from 'react';

// 메모 타입 정의
type NoteItem = {
  id: string;
  title: string;
  date: string;
  content: React.ReactNode;
  category?: string;
};

// 댓글 타입 정의
type CommentItem = {
  id: string;
  user: string;
  time: string;
  text: string;
  likes: number;
};

// 트윗 타입 정의
type TweetItem = {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
  replies: number;
  retweets: number;
  likes: number;
  views: string;
};

// 통화 기록 타입 정의
type CallHistoryItem = {
  id: string;
  name: string;
  type: string;
  time: string;
  isMissed: boolean;
  count?: number;
};

// 연락처 타입 정의
type ContactItem = {
  id: string;
  name: string;
  phone: string;
  isFavorite?: boolean;
};

// 메시지 말풍선 타입 정의
type MessageBubble = {
  id: string;
  sender: 'me' | 'other';
  senderName?: string;
  text: string;
  time?: string;
  dateDivider?: string;
};

// 메시지 대화방 타입 정의
type MessageThread = {
  id: string;
  name: string;
  unreadCount?: number;
  preview: string;
  time: string;
  messages: MessageBubble[];
};

export default function Home() {
  const [currentApp, setCurrentApp] = useState<
    | 'lock'
    | 'passcode'
    | 'call_incoming'
    | 'call_active'
    | 'home'
    | 'message'
    | 'note'
    | 'gallery'
    | 'instagram'
    | 'youtube'
    | 'x'
    | 'call'
    | 'safari'
    | 'kakaotalk'
  >('lock');

  const [passcode, setPasscode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  
  // 부재중 전화 알림 뱃지 상태
  const [missedCallCount, setMissedCallCount] = useState<number>(87);

  // 잠금화면 알림 노출 상태
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // 전화 거절 후 카톡 알림 팝업 상태
  const [showKakaoRejectToast, setShowKakaoRejectToast] = useState<boolean>(false);

  // 통화 중 자막 및 타이머 상태
  const [callTimer, setCallTimer] = useState<number>(0);
  const [subtitleIndex, setSubtitleIndex] = useState<number>(0);

  // 📌 메모장 상세 선택 상태
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  // 📸 인스타그램 스토리 보기 상태
  const [showDowoonStory, setShowDowoonStory] = useState<boolean>(false);
  const [instagramTab, setInstagramTab] = useState<'home' | 'search' | 'reels' | 'profile'>('home');

  // 🔴 유튜브 댓글 창 열림/닫힘 상태
  const [showYoutubeComments, setShowYoutubeComments] = useState<boolean>(false);

  // 🐦 X (트위터) 하단 탭 선택 상태
  const [twitterTab, setTwitterTab] = useState<'home' | 'search' | 'notification' | 'dm'>('home');

  // 🐦 X (트위터) 트렌드 선택 상태
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  // 📞 전화 앱 전용 상태
  const [phoneTab, setPhoneTab] = useState<'recents' | 'contacts' | 'keypad' | 'favorites'>('recents');
  const [callFilter, setCallFilter] = useState<'all' | 'missed'>('all');
  const [dialedNumber, setDialedNumber] = useState<string>('');

  // 💬 메시지 앱 선택된 대화방 ID
  const [selectedMessageThreadId, setSelectedMessageThreadId] = useState<string | null>('dowoon');

  // 💬 카카오톡 전용 상태
  const [kakaoTab, setKakaoTab] = useState<'friends' | 'chats' | 'openchat' | 'shopping' | 'more'>('chats');
  const [selectedKakaoChatId, setSelectedKakaoChatId] = useState<string | null>(null);
  const [selectedProfileContact, setSelectedProfileContact] = useState<ContactItem | null>(null);

  // 잠금화면 손전등 토글 상태
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);

  // 📞 전화 앱 연락처 데이터
  const CONTACTS_DATA: ContactItem[] = [
    { id: '1', name: '강아❤️', phone: '010-9876-0509', isFavorite: true },
    { id: '2', name: '강영현', phone: '010-1219-1219', isFavorite: true },
    { id: '3', name: '김원필', phone: '010-3333-1225', isFavorite: true },
    { id: '4', name: '아버지', phone: '010-8888-9999', isFavorite: true },
    { id: '5', name: '어머니', phone: '010-2222-3333', isFavorite: true },
    { id: '6', name: '정실장님 (매니저)', phone: '010-5555-7777', isFavorite: false },
    { id: '7', name: '박대표님 (소속사)', phone: '010-1004-1004', isFavorite: false },
    { id: '8', name: '최실용음악 학원', phone: '02-333-8888', isFavorite: false },
    { id: '9', name: '합정동 스튜디오', phone: '02-777-1234', isFavorite: false },
  ];

  // 💬 메시지(문자) 대화방 데이터
  const MESSAGE_THREADS: MessageThread[] = [
    {
      id: 'dowoon',
      name: '강아❤️',
      unreadCount: 1,
      preview: '햄... 방금 유튜브에 올라온 거 뭐고? 내한테 상의 한 마디도 없이...',
      time: '10:05',
      messages: [
        { id: 'm1', sender: 'other', text: '햄아!! 어디고? 내 지금 스튜디오 앞이다 퍼뜩 나온나!', dateDivider: '2025년 10월 12일' },
        { id: 'm2', sender: 'me', text: '오냐 금방 나갈게 차에서 기다려라' },
        { id: 'm3', sender: 'other', text: '추우니까 옷 따뜻하게 입고 온나 ☕️' },
        { id: 'm4', sender: 'other', text: '햄아아ㅏ나 회식끄ㅌ나거 집기능 중디ㅏ', dateDivider: '2025년 12월 24일' },
        { id: 'm5', sender: 'other', text: '너뮤 보그1스포 술마니다미안해오 ㅠㅠㅠㅠ' },
        { id: 'm6', sender: 'me', text: 'ㅋㅋㅋ 술 엄청 먹었네 택시 타고 오는 중이가? 오타 봐라 ㅋㅋㅋ' },
        { id: 'm7', sender: 'other', text: '웅 카카오택시 타써!! 기사님이 햄이 집 앞으로 가주신대 키키' },
        { id: 'm8', sender: 'me', text: '알았다 1층 내려가서 기다릴 테니까 조심히 와라 숙취해소제 사놔따~' },
        { id: 'm9', sender: 'other', text: '성진이 햄아 오늘 촬영 고생 많았다! 집 들어갈 때 맛있는 거 사갈까?', dateDivider: '2026년 5월 12일' },
        { id: 'm10', sender: 'me', text: '고맙다 도운이 ㅋㅋ 형 좋아하는 소금빵 사다주면 입 찢어지지' },
        { id: 'm11', sender: 'other', text: '알았다 금방 갈게! 내 퍼뜩 드갈 테니까 세수하고 기다리고 있어라 햄아 ❤️' },
        { id: 'm12', sender: 'other', text: '햄아, 와 연락이 안 되노? 무슨 일 있는 거 아니제?', dateDivider: '2026년 6월 5일' },
        { id: 'm13', sender: 'other', text: '햄아 제발 문자 좀 봐라... 나 손 떨려서 아무것도 못 하겠다. 진짜 어디 아픈 거 아니제?' },
        { id: 'm14', sender: 'other', text: '햄... 방금 유튜브에 올라온 거 뭐고? 내한테 상의 한 마디도 없이 헤어졌다고 영상 올리면 나는 어쩌라고... 햄아 진짜 어디 있노 나한테 말좀 해봐라 제발 ㅠㅠ', dateDivider: '오늘' },
      ],
    },
    {
      id: 'wonpil',
      name: '김원필',
      preview: '성진이 형, 도운이 연락 받았어요? 애 울면서 나한테 전화 왔던데...',
      time: '09:42',
      messages: [
        { id: 'w1', sender: 'other', text: '성진이 형! 스튜디오 비밀번호 바꿨어요? 키패드 안 열리는데 ㅠㅠ', dateDivider: '2026년 3월 15일' },
        { id: 'w2', sender: 'me', text: '아 맞다 뒤에 특수문자 #에서 *로 바꿨다 미안ㅋㅋ' },
        { id: 'w3', sender: 'other', text: '아 어쩐지 ㅋㅋㅋ 오케이 들왔어요! 오늘 야식 족발 어때요?' },
        { id: 'w4', sender: 'me', text: '콜 도운이한테도 물어보고 시켜라' },
        { id: 'w5', sender: 'other', text: '성진이 형, 도운이 연락 받았어요? 애 울면서 나한테 전화 왔던데 무슨 일이에요?', dateDivider: '오늘' },
        { id: 'w6', sender: 'other', text: '형 둘이 싸웠어요? 무슨 일 생긴 건 아니죠? 연락 보는 대로 나한테 전화 좀 줘요.' },
      ],
    },
    {
      id: 'younghyun',
      name: '강영현',
      preview: '성진이 형, 영문도 모르고 도운이 혼자 저러고 있는데 제발 말 좀 해주세요',
      time: '09:15',
      messages: [
        { id: 'y1', sender: 'other', text: '형 새로 쓴 가사 메일로 보냈어요! 시간 될 때 피드백 좀 부탁해요', dateDivider: '2026년 4월 2일' },
        { id: 'y2', sender: 'me', text: '오냐 확인해볼게 고생했다' },
        { id: 'y3', sender: 'other', text: '형 작업실 올 때 치킨 사갈 건데 후라이드 반 양념 반 괜찮죠?' },
        { id: 'y4', sender: 'me', text: '완전 좋지 조심히 온나' },
        { id: 'y5', sender: 'other', text: '성진이 형, 형 지금 어디예요? 도운이 인스타 스토리 보고 놀라서 연락해요.', dateDivider: '오늘' },
        { id: 'y6', sender: 'other', text: '영문도 모르고 도운이 혼자 저러고 있는데 제발 말 좀 해주세요... 사정이 있으면 우리한테라도 말을 하든가요.' },
      ],
    },
    {
      id: 'manager_jung',
      name: '정실장님 (매니저)',
      preview: '성진씨, 회사 상부에서도 기사 때문에 난리 났습니다. 어디 계십니까?',
      time: '08:30',
      messages: [
        { id: 'mg1', sender: 'other', text: '성진씨, 다음 주 촬영 일정 변경 건으로 메일 보내뒀습니다. 확인 부탁해요.', dateDivider: '6월 25일' },
        { id: 'mg2', sender: 'other', text: '성진씨, 회사 상부에서도 기사 때문에 난리 났습니다. 대표님이 당장 연락하라시는데 전화 좀 받으세요.', dateDivider: '오늘' }
      ]
    },
    {
      id: 'courier_cj',
      name: 'CJ대한통운',
      preview: '[CJ대한통운] 고객님의 상품이 문 앞에 배송 완료되었습니다.',
      time: '어제',
      messages: [
        { id: 'c1', sender: 'other', text: '[CJ대한통운 배송완료]\n박*진 고객님, 주문하신 상품이 [문 앞]에 배송 완료되었습니다.\n- 운송장번호: 4092-8812-9931\n- 상품명: 프레시지 밀키트 외 2건', dateDivider: '6월 27일' },
      ],
    },
    {
      id: 'card_kb',
      name: 'KB국민카드',
      preview: '[KB국민] 박*진님 06/27 21:10 32,500원 합정 베이커리 승인',
      time: '6월 27일',
      messages: [
        { id: 'kb1', sender: 'other', text: '[KB국민] 박*진님 06/27 21:10 32,500원 일시불 합정 베이커리 승인 (누적 1,420,000원)', dateDivider: '6월 27일' }
      ]
    },
    {
      id: 'coupang',
      name: '쿠팡',
      preview: '[쿠팡] 주문하신 로켓프레시 상품의 배송이 시작되었습니다.',
      time: '6월 26일',
      messages: [
        { id: 'cp1', sender: 'other', text: '[쿠팡] 고객님의 주문 상품 [유기농 저지방 우유 외 3건] 배송이 시작되었습니다. 새벽 7시 전도착 예정입니다.', dateDivider: '6월 26일' }
      ]
    },
    {
      id: 'web발신_kt',
      name: 'KT고객센터',
      preview: '[WEB 발신] 6월 통신요금 명세서가 발행되었습니다.',
      time: '6월 22일',
      messages: [
        { id: 'kt1', sender: 'other', text: '[KT] 6월 모바일 통신요금 청구 금액은 68,200원입니다. 상세 내역은 앱에서 확인 가능합니다.', dateDivider: '6월 22일' }
      ]
    },
    {
      id: 'samsung_service',
      name: '삼성전자서비스',
      preview: '[삼성전자] C/S 기사 방문 예약이 정상 완료되었습니다.',
      time: '6월 20일',
      messages: [
        { id: 'ss1', sender: 'other', text: '[삼성전자] 6월 21일 14:00 세탁기 점검 서비스가 예약되었습니다. 문의: 1588-3366', dateDivider: '6월 20일' }
      ]
    }
  ];

  // 💬 카카오톡 대화방 데이터
  const [kakaoThreads, setKakaoThreads] = useState<MessageThread[]>([
    {
      id: 'k_dowoon',
      name: '강아❤️',
      unreadCount: 3,
      preview: '전화 좀 받아줘 햄아... 제발 ㅠㅠ',
      time: '오전 10:02',
      messages: [
        { id: 'kd_p1', sender: 'other', senderName: '강아❤️', text: '햄아 오늘 연습실 셋팅 다 해놨다! 퍼뜩 온나~', dateDivider: '2025년 8월 14일' },
        { id: 'kd_p2', sender: 'me', text: '오냐 고생했다 도운이 ㅋㅋ 커피 사가는 중이다' },
        { id: 'kd_p3', sender: 'other', senderName: '강아❤️', text: '오예 나는 아아!! 연하게 부탁해 햄아 ☕️' },
        { id: 'kd_p4', sender: 'other', senderName: '강아❤️', text: '햄아 오늘 곰개 채널 구독자 10만 찍었다!! 미친 거 아니냐 ㅋㅋ', dateDivider: '2025년 11월 02일' },
        { id: 'kd_p5', sender: 'me', text: 'ㅋㅋㅋㅋ 다 도운이 네가 귀여워서 그렇다 커뮤니티에 감사글 쓰자' },
        { id: 'kd_p6', sender: 'other', senderName: '강아❤️', text: '아 진짜 성진이 햄 덕분이다 고맙다 참말로 ❤️' },
        { id: 'kd_p7', sender: 'other', senderName: '강아❤️', text: '햄아 자나??', dateDivider: '2026년 2월 14일' },
        { id: 'kd_p8', sender: 'me', text: '아니 안 자는데 와?' },
        { id: 'kd_p9', sender: 'other', senderName: '강아❤️', text: '발렌타인데이라고 팬분들이 작업실로 초콜릿 보낸 거 내 혼자 다 먹어버렸다 키키' },
        { id: 'kd_p10', sender: 'me', text: '이 돼지야 내 거 하나는 남겨놓지 ㅋㅋㅋ' },
        { id: 'kd0_1', sender: 'other', senderName: '강아❤️', text: '햄아 오늘 연습실 몇 시에 갈 거임?', dateDivider: '2026년 6월 20일' },
        { id: 'kd0_2', sender: 'me', text: '난 2시쯤 드갈 것 같다. 먼저 가있어라~' },
        { id: 'kd0_3', sender: 'other', senderName: '강아❤️', text: '오냐 아아 한 잔 사다주라 햄아 🥤' },
        { id: 'kd1', sender: 'other', senderName: '강아❤️', text: '햄아 기사 난 거 뭐야??', dateDivider: '오늘 6월 28일 일요일' },
        { id: 'kd2', sender: 'other', senderName: '강아❤️', text: '지인들한테 연락 계속 오는데 나는 아무것도 몰라서 너무 당황스러워' },
        { id: 'kd3', sender: 'other', senderName: '강아❤️', text: '전화 좀 받아줘 햄아... 제발 ㅠㅠ' },
      ]
    },
    {
      id: 'k_dad',
      name: '아버지',
      unreadCount: 1,
      preview: '네가 뭔데 혼자 결정을 해? 당장 전화 안 받니?',
      time: '오전 09:30',
      messages: [
        { id: 'da_p1', sender: 'other', senderName: '아버지', text: '설 연휴에 집에 내려올 때 차 밀리니까 일찍 출발해라.', dateDivider: '2026년 1월 20일' },
        { id: 'da_p2', sender: 'me', text: '네 아버지 출발할 때 연락드리겠습니다.' },
        { id: 'da0_1', sender: 'other', senderName: '아버지', text: '다음 주 주말에 부산 내려올 때 시간 비워둬라.', dateDivider: '2026년 5월 10일' },
        { id: 'da0_2', sender: 'me', text: '네 아버지 스케줄 확인해보겠습니다.' },
        { id: 'da1', sender: 'other', senderName: '아버지', text: '성진아, 네가 저지른 일 기사로 다 봤다.', dateDivider: '오늘 6월 28일 일요일' },
        { id: 'da2', sender: 'other', senderName: '아버지', text: '어른들이 가만히 있으니까 우습니? 당장 집으로 내려오든가 전화 받어라. 네 행동 하나에 집안이 이게 뭐냐!' },
      ]
    },
    {
      id: 'k_mom',
      name: '어머니',
      unreadCount: 2,
      preview: '성진아 아빠 지금 많이 화나셨어... 대들지 말고 그냥 알았다고 해라 알겠지?',
      time: '오전 09:35',
      messages: [
        { id: 'mo_p1', sender: 'other', senderName: '어머니', text: '성진아 도운이랑 같이 먹으라고 갈비찜이랑 반찬 택배로 보냈다.', dateDivider: '2026년 3월 12일' },
        { id: 'mo_p2', sender: 'me', text: '감사합니다 엄마 도운이도 엄청 좋아해요!' },
        { id: 'mo0_1', sender: 'other', senderName: '어머니', text: '성진아 밥은 잘 챙겨 먹고 다니지? 반찬 몇 개 택배로 보냈다.', dateDivider: '2026년 6월 15일' },
        { id: 'mo0_2', sender: 'me', text: '네 엄마 잘 먹을게요 고마워요 ❤️' },
        { id: 'mo1', sender: 'other', senderName: '어머니', text: '성진아 연락 좀 해봐. 아빠 지금 네 기사 보고 뒷목 잡으셨다.', dateDivider: '오늘 6월 28일 일요일' },
        { id: 'mo2', sender: 'other', senderName: '어머니', text: '아빠 성격 알잖아. 지금 화나셨을 때 네가 또 고집 부리고 대들면 사태 더 커져. 그냥 아빠 말씀에 무조건 알았다고 숙이고 들어가라. 엄마가 조만간 얘기해 볼 테니까...' },
      ]
    },
    {
      id: 'k_group',
      name: 'DAY6 🎸',
      unreadCount: 42,
      preview: '원필: 도운이도 지금 패닉 와서 연락처 불통이고...',
      time: '오전 08:50',
      messages: [
        { id: 'g_p1', sender: 'other', senderName: '강영현', text: '이번 신곡 트랙리스트 공유합니다. 다들 피드백 부탁해요!', dateDivider: '2026년 4월 10일' },
        { id: 'g_p2', sender: 'other', senderName: '김원필', text: '우와 곡 너무 좋다!! 도운이 드럼 톤도 대박임' },
        { id: 'g0_1', sender: 'other', senderName: '김원필', text: '오늘 합정 스튜디오 6시 예약 맞죠?', dateDivider: '2026년 6월 24일' },
        { id: 'g0_2', sender: 'me', text: 'ㅇㅇ 맞춰서 오면 된다' },
        { id: 'g1', sender: 'other', senderName: '강영현', text: '성진이 형, 다들 기사 봤어요? 이게 무슨 일이에요 도대체', dateDivider: '오늘 6월 28일 일요일' },
        { id: 'g1_sub', sender: 'other', senderName: '강영현', text: '원필아, 도운이 기사 봤어?' },
        { id: 'g2', sender: 'other', senderName: '김원필', text: '도운이도 지금 패닉 와서 연락처 불통이고... 형 무슨 일 있는 거죠?' },
      ]
    },
    {
      id: 'k_younghyun',
      name: '강영현',
      preview: '형 오늘 저녁 합정에서 먹을 건가요?',
      time: '어제',
      messages: [
        { id: 'ky1', sender: 'other', senderName: '강영현', text: '형 오늘 저녁 합정에서 먹을 건가요?', dateDivider: '6월 27일' },
        { id: 'ky2', sender: 'me', text: '오늘은 좀 일 있어서 먼저 드가볼게!' }
      ]
    },
    {
      id: 'k_wonpil',
      name: '김원필',
      preview: '형 피아노 악보 메일함 확인 한번 해주세요!',
      time: '6월 26일',
      messages: [
        { id: 'kw1', sender: 'other', senderName: '김원필', text: '형 피아노 악보 메일함 확인 한번 해주세요!', dateDivider: '6월 26일' },
        { id: 'kw2', sender: 'me', text: '오냐 확인해볼게 고맙다' }
      ]
    },
    {
      id: 'k_ad_kakao',
      name: '카카오톡 채널',
      unreadCount: 1,
      preview: '[광고] 6월 카카오페이 럭키 라이프 혜택 모아보기!',
      time: '어제',
      messages: [
        { id: 'ad1_1', sender: 'other', senderName: '카카오톡', text: '[카카오톡 채널]\n박*진님, 이번 달 카카오페이 포인트 최대 15,000p 적립 기회를 놓치지 마세요!', dateDivider: '6월 27일' }
      ]
    },
    {
      id: 'k_ad_musinsa',
      name: '무신사 (MUSINSA)',
      preview: '[광고] 여름 아우터 & 티셔츠 최대 80% 파이널 세일 단 3일간!',
      time: '6월 25일',
      messages: [
        { id: 'ad2_1', sender: 'other', senderName: '무신사', text: '[무신사 파이널 세일]\n여름 인기 스니커즈 및 반팔 티셔츠 쿠폰이 발급되었습니다.', dateDivider: '6월 25일' }
      ]
    },
    {
      id: 'k_ad_coupang',
      name: '쿠팡 (Coupang)',
      preview: '[광고] 고객님을 위한 로켓와우 단독 특가 상품 도착!',
      time: '6월 24일',
      messages: [
        { id: 'ad3_1', sender: 'other', senderName: '쿠팡', text: '[쿠팡 특가]\n장바구니에 담으신 상품의 가격이 인하되었습니다. 지금 확인해 보세요.', dateDivider: '6월 24일' }
      ]
    },
    {
      id: 'k_manager',
      name: '정실장님 (매니저)',
      preview: '네 알겠습니다. 스케줄 조정해둘게요.',
      time: '6월 20일',
      messages: [
        { id: 'km1', sender: 'me', text: '실장님 다음 주 화요일 개인 스케줄 조정 부탁드립니다.' },
        { id: 'km2', sender: 'other', senderName: '정실장님', text: '네 알겠습니다. 스케줄 조정해둘게요.', dateDivider: '6월 20일' }
      ]
    },
    {
      id: 'k_studio',
      name: '합정동 스튜디오',
      preview: '예약이 정상적으로 확정되었습니다. 감사합니다.',
      time: '6월 18일',
      messages: [
        { id: 'kst1', sender: 'other', senderName: '스튜디오', text: '6/24 18:00 합정 A룸 예약 확정되었습니다.', dateDivider: '6월 18일' }
      ]
    }
  ]);

  // 📞 전화 앱 통화 기록 데이터
  const CALL_HISTORY: CallHistoryItem[] = [
    { id: '1', name: '강아❤️', type: '휴대폰', time: '오늘 02:40', isMissed: true, count: 42 },
    { id: '2', name: '강아❤️', type: '휴대폰', time: '오늘 01:15', isMissed: true, count: 18 },
    { id: '3', name: '김원필', type: '휴대폰', time: '오늘 00:52', isMissed: true, count: 5 },
    { id: '4', name: '강영현', type: '휴대폰', time: '어제 23:40', isMissed: true, count: 3 },
    { id: '5', name: '강아❤️', type: '휴대폰', time: '어제 23:14', isMissed: true, count: 28 },
    { id: '6', name: '정실장님 (매니저)', type: '휴대폰', time: '어제 21:05', isMissed: true, count: 12 },
    { id: '7', name: '김원필', type: '휴대폰', time: '어제 18:30', isMissed: false },
    { id: '8', name: '어머니', type: '휴대폰', time: '어제 15:20', isMissed: true, count: 2 },
    { id: '9', name: '쿠팡 로켓프레시', type: '휴대폰', time: '6월 26일', isMissed: false },
    { id: '10', name: '강영현', type: '휴대폰', time: '6월 25일', isMissed: false },
    { id: '11', name: '아버지', type: '국제전화', time: '6월 24일', isMissed: true, count: 4 },
    { id: '12', name: '강아❤️', type: '휴대폰', time: '6월 23일', isMissed: false },
    { id: '13', name: '삼성 가전 A/S', type: '대표번호', time: '6월 20일', isMissed: false },
    { id: '14', name: '어머니', type: '휴대폰', time: '6월 18일', isMissed: false },
  ];

  // 트위터 실시간 트렌드 목록
  const TRENDS_LIST = [
    { rank: 1, category: '대한민국 실시간 트렌드', keyword: '성진도운', tweets: '4.2만 트윗' },
    { rank: 2, category: '대한민국 실시간 트렌드', keyword: '곰개🐻🐶', tweets: '2.8만 트윗' },
    { rank: 3, category: '실시간 트렌드', keyword: '해명방송', tweets: '1.5만 트윗' },
    { rank: 4, category: '음악 • 트렌드', keyword: 'DAY6', tweets: '3.1만 트윗' },
    { rank: 5, category: '일상 • 트렌드', keyword: '소금빵', tweets: '8,420 트윗' },
  ];

  // 트위터 피드 데이터
  const TWEETS_DATA: TweetItem[] = [
    {
      id: '1',
      author: '덕후A',
      handle: '@otaku_a',
      time: '5분',
      content: '아 미친 방금 곰개🐻🐶 채널 들어갔다가 식은땀 흘림... 헤어졌습니다 뭔데 진짜? 나 울어 ㅠㅠㅠㅠㅠ',
      replies: 12,
      retweets: 84,
      likes: 210,
      views: '1.2만',
    },
    {
      id: '2',
      author: '도운이맘',
      handle: '@dowoon_love',
      time: '12분',
      content: '도운님 인스타 스토리 본 사람 있으심? 자기도 몰랐다고 얼떨떨해하는데 진짜 박성진 혼자 올린 거냐고 무슨 사정인데 제발 말 좀 해주라 ㅠㅠ',
      replies: 28,
      retweets: 312,
      likes: 540,
      views: '3.4만',
    },
    {
      id: '3',
      author: '일상계',
      handle: '@daily_life',
      time: '20분',
      content: '오늘 퇴근길 날씨 왜 이렇게 춥냐... 집 가면서 따뜻한 아메리카노에 소금빵 사먹어야지 ☕️',
      replies: 2,
      retweets: 1,
      likes: 15,
      views: '420',
    },
    {
      id: '4',
      author: '연예이슈알리미',
      handle: '@issue_tracker',
      time: '35분',
      content: '속보) 커플 유튜버 곰개🐻🐶 (박성진, 도운), 돌연 이별 영상 게재... 도운님 측 "상의된 바 없다" 파장 예상',
      replies: 45,
      retweets: 520,
      likes: 890,
      views: '8.9만',
    },
    {
      id: '5',
      author: '박성진과몰입녀',
      handle: '@sungjin_fan',
      time: '1시간',
      content: '성진아 네가 진짜 이럴 리가 없잖아... 무슨 협박이라도 당한 거 아니면 말이 안 되는데??? 제발 해명방송이라도 켜봐...',
      replies: 19,
      retweets: 140,
      likes: 380,
      views: '2.1만',
    },
    {
      id: '6',
      author: '음악방송작가',
      handle: '@writer_music',
      time: '1시간 전',
      content: '오늘 녹화 현장 분위기 엄청 심각함... 스태프들도 기사 보고 다들 깜짝 놀랐다는데 어떡하냐 진짜',
      replies: 8,
      retweets: 45,
      likes: 120,
      views: '5.1만',
    },
    {
      id: '7',
      author: '홍대인근주민',
      handle: '@hongdae_life',
      time: '2시간 전',
      content: '방금 합정 스튜디오 근처에서 매니저 차량 급하게 나가는 거 봤는데... 설마 진짜 별일 아니어야 할 텐데 걱정되네',
      replies: 5,
      retweets: 22,
      likes: 95,
      views: '3.8만',
    },
    {
      id: '8',
      author: '순찰러',
      handle: '@watcher_99',
      time: '3시간 전',
      content: '유튜브 채널 커뮤니티나 다른 SNS는 다 조용한데 왜 갑자기 저런 영상만 덜렁 올라온 거지? 의문투성이임',
      replies: 14,
      retweets: 67,
      likes: 230,
      views: '7.4만',
    }
  ];

  // 인스타그램 피드 데이터
  const INSTAGRAM_FEEDS = [
    {
      id: 'f1',
      author: 'dkanehahffk',
      location: '서울 스튜디오',
      content: '작업실 풍경 🎸',
      likes: '1,240개',
      time: '2시간 전'
    },
    {
      id: 'f2',
      author: 'ddowoon',
      location: '한강 공원',
      content: '날씨 좋다 산책 🐶',
      likes: '3,890개',
      time: '5시간 전'
    }
  ];

  // 유튜브 댓글 목록 데이터
  const YOUTUBE_COMMENTS: CommentItem[] = [
    { id: '1', user: '초코쿠키', time: '방금 전', text: '아니 도운님 스토리에 자기도 몰랐다고 올라왔는데 이거 박성진 혼자 올린 거임??? 진짜 무책임하다...', likes: 342 },
    { id: '2', user: '냥냥펀치', time: '3분 전', text: '수년 만난 사람한테 잠수이별 통보하고 영상 올리는 건 예의가 아니지 성진아 ㅡㅡ 도운이 어떡하냐고', likes: 189 },
    { id: '3', user: '하늘구름', time: '5분 전', text: '무슨 사정이 있는 거 아닌가... 박성진 원래 이런 사람 아니잖아 ㅠㅠ 도운이랑 잘 어울렸는데', likes: 95 },
    { id: '4', user: '민트초코파', time: '8분 전', text: '미친 방금 올라온 헤어졌습니다 영상 진짜임...? 도운이 반응 보니까 진짜 아무것도 몰랐던 모양임', likes: 210 },
  ];

  // 📝 메모장 데이터 리스트
  const NOTES_DATA: NoteItem[] = [
    {
      id: '1',
      title: '📌 도운이에게 (절대 들키면 안 됨)',
      date: '6월 28일',
      category: '비밀 메모',
      content: (
        <div className="space-y-3">
          <p className="text-amber-400 font-bold text-sm">📌 도운이에게 (절대 들키면 안 됨)</p>
          <p className="text-zinc-300 leading-relaxed text-[12px]">
            도운아, 정말 미안하다. 아버지가 한국에 들어오셔서 다 알게 되셨다. 도운이 너한테까지 손대겠다고, 당장 안 끝내면 네 인생 망쳐놓겠다고 협박하시는데 내가 무슨 수로 버티겠노...
          </p>
          <p className="text-zinc-300 leading-relaxed text-[12px]">
            내가 욕 다 먹고 나쁜 놈 되는 게 낫지, 네가 다치는 건 죽어도 못 본다. 미안하다 도운아. 상의도 없이 영상 올려서 진짜 미안하다. 평생 나 원망하면서 살아라...
          </p>
          <p className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">2026년 6월 28일 오후 9:41 작성됨</p>
        </div>
      ),
    },
    {
      id: '2',
      title: '🚨 [긴급] 아버지 음성 메시지 요약',
      date: '6월 27일',
      category: '비밀 메모',
      content: (
        <div className="space-y-3">
          <p className="text-red-400 font-bold text-sm">🚨 [긴급] 아버지 음성 메시지 요약</p>
          <p className="text-zinc-300 leading-relaxed text-[12px]">
            - 당장 유튜브 채널 내리고 관계 정리 기사 내라.<br />
            - 네 고집 피우면 그 아이 방송국 출연이고 뭐고 전부 다 끝장내버릴 테니까 순진하게 버틸 생각 마라.<br />
            - 내일 오전까지 확실하게 마무리된 거 눈으로 확인한다.
          </p>
          <p className="text-zinc-500 text-[11px] mt-2">※ 이 메모는 읽은 즉시 삭제할 것.</p>
          <p className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">2026년 6월 27일 오후 11:15 작성됨</p>
        </div>
      ),
    },
    {
      id: '3',
      title: '📝 도운이 챙길 것들 (기념일 & 취향)',
      date: '5월 14일',
      category: '일기',
      content: (
        <div className="space-y-3">
          <p className="text-white font-bold text-sm">📝 도운이 챙길 것들 (기념일 & 취향)</p>
          <ul className="list-disc list-inside text-[12px] text-zinc-300 space-y-2 leading-relaxed">
            <li>도운이 매운 거 잘 못 먹음 (떡볶이는 무조건 순한맛만)</li>
            <li>향수 취향: 우디하고 포근한 계열 좋아함</li>
            <li>커플 1000일 선물: 도운이가 가방에 매달고 싶어하던 시계 미리 주문해두기</li>
            <li>도운이 잘 때 이불 차니까 새벽에 깨면 꼭 덮어주기</li>
            <li>힘들 때 은근히 허리 감싸 안아주면 금방 풀림</li>
          </ul>
          <p className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">2026년 5월 14일 오전 1:12 작성됨</p>
        </div>
      ),
    },
    {
      id: '4',
      title: '🎵 곡 작업 아이디어 & 메모',
      date: '5월 2일',
      category: '작업',
      content: (
        <div className="space-y-3">
          <p className="text-white font-bold text-sm">🎵 곡 작업 아이디어 & 메모</p>
          <p className="text-zinc-300 text-[12px] leading-relaxed">
            - 코드 진행: C - G - Am - F (아련한 느낌)<br />
            - 가사 키워드: 여름밤, 골목길, 네 웃음소리, 다시 돌아갈 수 있다면<br />
            - 브릿지 부분 도운이 코러스 넣으면 감정선 극대화될 듯. 나중에 같이 녹음해보자.
          </p>
          <p className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">2026년 5월 2일 오후 8:30 작성됨</p>
        </div>
      ),
    },
    {
      id: '5',
      title: '🛒 마트 장보기 & 생필품 리스트',
      date: '4월 20일',
      category: '일상',
      content: (
        <div className="space-y-3">
          <p className="text-white font-bold text-sm">🛒 마트 장보기 & 생필품 리스트</p>
          <p className="text-zinc-300 text-[12px] leading-relaxed">
            - 계란 한 판<br />
            - 햇반 12개 묶음<br />
            - 도운이가 좋아하는 소금빵 3개<br />
            - 저지방 우유<br />
            - 종량제 봉투 20L<br />
            - 세탁세제 떨어져감
          </p>
          <p className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">2026년 4월 20일 오후 4:05 작성됨</p>
        </div>
      ),
    },
  ];

  const DOUN_SUBTITLES = [
    "햄아... 햄아 맞제?! 제발 말 좀 해봐라!",
    "어디 있었는데... 왜 내 연락 다 피하는데...",
    "유튜브에 올린 건 또 뭔데?! 와 나한테 한 마디도 없이 헤어졌다고 올리노!",
    "햄아 제발... 내가 다 잘못했다... 얼굴 보고 얘기하자 제발...",
    "지금 집 앞이다... 문 좀 열어봐라 햄아 제발ㅠㅠ"
  ];

  const CORRECT_PASSCODE = '123456';

  const KEYPAD_DATA = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentApp === 'call_active') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
      setSubtitleIndex(0);
    }
    return () => clearInterval(interval);
  }, [currentApp]);

  useEffect(() => {
    if (currentApp === 'call_active') {
      const subtitleInterval = setInterval(() => {
        setSubtitleIndex((prev) => (prev < DOUN_SUBTITLES.length - 1 ? prev + 1 : prev));
      }, 3500);
      return () => clearInterval(subtitleInterval);
    }
  }, [currentApp]);

  const handleNumClick = (num: string) => {
    if (passcode.length < 6) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);

      if (newPasscode.length === 6) {
        if (newPasscode === CORRECT_PASSCODE) {
          setTimeout(() => {
            setCurrentApp('call_incoming');
            setPasscode('');
            setIsError(false);
          }, 200);
        } else {
          setIsError(true);
          setTimeout(() => {
            setPasscode('');
            setIsError(false);
          }, 800);
        }
      }
    }
  };

  const handleAcceptCall = () => {
    setCurrentApp('call_active');
  };

  const handleRejectCall = () => {
    setMissedCallCount((prev) => prev + 1);
    setCurrentApp('home');
    setTimeout(() => {
      setShowKakaoRejectToast(true);
      setTimeout(() => setShowKakaoRejectToast(false), 4000);
    }, 1200);
  };

  const handleEndCall = () => {
    setMissedCallCount((prev) => prev + 1);
    setCurrentApp('home');
  };

  const handleDelete = () => {
    setPasscode((prev) => prev.slice(0, -1));
  };

  const handleCancel = () => {
    setCurrentApp('lock');
    setPasscode('');
    setIsError(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 📌 카카오톡 대화방 선택 시 안 읽은 뱃지 제거 처리
  const handleSelectKakaoChat = (threadId: string) => {
    setSelectedKakaoChatId(threadId);
    setKakaoThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
      )
    );
  };

  const activeThread = MESSAGE_THREADS.find((t) => t.id === selectedMessageThreadId);
  const activeKakaoThread = kakaoThreads.find((t) => t.id === selectedKakaoChatId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4 select-none font-sans">
      {/* 아이폰 프레임 */}
      <div className={`w-[375px] h-[780px] bg-black rounded-[55px] p-3 border-[6px] border-zinc-700 shadow-[0_0_80px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${isFlashlightOn && currentApp === 'lock' ? 'ring-4 ring-yellow-300/60' : ''}`}>
        
        {/* 상단 다이나믹 아일랜드 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[115px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-2.5 shadow-md">
          <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40 border border-blue-500/30" />
        </div>

        {/* 전화 거절 후 카카오톡 상단 알림 */}
        {showKakaoRejectToast && currentApp === 'home' && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 w-[92%] bg-white/90 backdrop-blur-xl rounded-2xl p-3 text-black shadow-2xl border border-black/10 transition-all duration-500 ease-out transform translate-y-0 opacity-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-xs font-bold text-white">💬</div>
                <span className="text-[11px] font-bold text-zinc-700">카카오톡</span>
              </div>
              <span className="text-[10px] text-zinc-400">방금 전</span>
            </div>
            <p className="text-[12px] font-bold text-black">강아❤️</p>
            <p className="text-[11px] text-zinc-800 leading-snug">
              햄아 와 전화 안 받노??? 제발 전화 좀 받아라 진짜!!! ㅠㅠ
            </p>
          </div>
        )}

        {/* --- [0] 잠금 화면 --- */}
        {currentApp === 'lock' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#500014] via-[#9B0026] to-[#2D0036] flex flex-col justify-between p-6 pt-2 text-white z-10 transition-all duration-300">
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-600/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-20 flex flex-col items-center w-full pt-1">
              <div className="flex justify-between items-center text-[13px] font-bold w-full px-4.5">
                <span className="tracking-tight">KT</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-[1.5px] h-3">
                    <div className="w-[2.5px] h-[30%] bg-white rounded-full" />
                    <div className="w-[2.5px] h-[55%] bg-white rounded-full" />
                    <div className="w-[2.5px] h-[80%] bg-white rounded-full" />
                    <div className="w-[2.5px] h-[100%] bg-white rounded-full" />
                  </div>
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 3C7.95 3 4.21 4.34 1.2 6.6L3 9c2.45-1.84 5.5-3 9-3s6.55 1.16 9 3l1.8-2.4C19.79 4.34 16.05 3 12 3zm0 6c-2.67 0-5.12.83-7.15 2.25L6.67 13.5C8.22 12.55 10.05 12 12 12s3.78.55 5.33 1.5l1.82-2.25C17.12 9.83 14.67 9 12 9zm0 6c-1.33 0-2.53.38-3.55 1.03l3.55 4.47 3.55-4.47C14.53 15.38 13.33 15 12 15z"/></svg>
                  <div className="w-5 h-2.5 border border-white rounded-[3.5px] p-[1px] flex items-center">
                    <div className="w-full h-full bg-white rounded-[1.5px]" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setCurrentApp('passcode')}
                className="text-center mt-6 cursor-pointer"
              >
                <p className="text-[17px] font-medium text-pink-100/90 tracking-tight">6월 28일 일요일</p>
                <p className="text-[76px] font-extrabold tracking-tighter mt-[-6px] text-pink-100 drop-shadow-lg leading-none font-sans">
                  10:07
                </p>
              </div>
            </div>

            {/* 잠금화면 알림 영역 */}
            <div className={`relative z-30 w-full px-1 mt-auto mb-2 flex flex-col gap-2 max-h-[260px] overflow-y-auto no-scrollbar transition-all duration-500 transform ${
              showNotification ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}>
              <div onClick={() => setCurrentApp('passcode')} className="w-full bg-black/55 backdrop-blur-2xl border border-white/15 rounded-[20px] p-2.5 text-white shadow-2xl cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md overflow-hidden flex items-center justify-center bg-red-600">
                      <img src="/icons/youtube.png" alt="YouTube" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/80">YOUTUBE • 방금 전</span>
                  </div>
                </div>
                <p className="text-[12px] font-bold text-white">새 댓글: 민트초코파</p>
                <p className="text-[11px] text-zinc-200 leading-tight">미친 방금 올라온 헤어졌습니다 영상 진짜임...?</p>
              </div>

              <div onClick={() => setCurrentApp('passcode')} className="w-full bg-black/55 backdrop-blur-2xl border border-white/15 rounded-[20px] p-2.5 text-white shadow-2xl cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md overflow-hidden flex items-center justify-center bg-red-600">
                      <img src="/icons/youtube.png" alt="YouTube" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/80">YOUTUBE • 3분 전</span>
                  </div>
                </div>
                <p className="text-[12px] font-bold text-white">새 댓글: 초코쿠키</p>
                <p className="text-[11px] text-zinc-200 leading-tight">아니 도운님 스토리에 자기도 몰랐다고 올라왔는데...</p>
              </div>

              <div onClick={() => setCurrentApp('passcode')} className="w-full bg-black/55 backdrop-blur-2xl border border-white/15 rounded-[20px] p-2.5 text-white shadow-2xl cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md overflow-hidden flex items-center justify-center bg-red-600">
                      <img src="/icons/youtube.png" alt="YouTube" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/80">YOUTUBE • 7분 전</span>
                  </div>
                </div>
                <p className="text-[12px] font-bold text-white">새 댓글: 냥냥펀치</p>
                <p className="text-[11px] text-zinc-200 leading-tight">수년 만난 사람한테 잠수이별 통보하고 영상 올리는 건...</p>
              </div>
            </div>

            {/* 잠금화면 하단 버튼 영역 */}
            <div className="relative z-30 flex justify-between items-center px-4 pb-2 mt-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFlashlightOn(!isFlashlightOn); }} 
                className={`w-11 h-11 rounded-full backdrop-blur-xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${isFlashlightOn ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-black/40 text-white border border-white/20'}`}
                title="손전등"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 2h12v3l-2.5 3.5V20a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8.5L6 5V2zm2 2v0.5l2.5 3.5h3L16 4.5V4H8zm2.5 6.5V20h3v-9.5h-3zM12 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </button>

              <div onClick={() => setCurrentApp('passcode')} className="text-[11px] text-white/60 font-medium cursor-pointer">
                화면을 터치하여 암호 입력
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentApp('passcode'); }} 
                className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                title="카메라"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4 6h3l2-2h6l2 2h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm8 13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0-2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* --- [1] 비밀번호 입력 화면 --- */}
        {currentApp === 'passcode' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#9E4B00] via-[#851C0C] to-[#2B0E3D] backdrop-blur-3xl flex flex-col justify-between pt-3 pb-10 px-6 z-20 text-white">
            <div className="flex justify-between items-center text-[13px] font-bold w-full px-4.5 pt-1">
              <span className="tracking-tight">KT</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[1.5px] h-3">
                  <div className="w-[2.5px] h-[30%] bg-white rounded-full" />
                  <div className="w-[2.5px] h-[55%] bg-white rounded-full" />
                  <div className="w-[2.5px] h-[80%] bg-white rounded-full" />
                  <div className="w-[2.5px] h-[100%] bg-white rounded-full" />
                </div>
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 3C7.95 3 4.21 4.34 1.2 6.6L3 9c2.45-1.84 5.5-3 9-3s6.55 1.16 9 3l1.8-2.4C19.79 4.34 16.05 3 12 3zm0 6c-2.67 0-5.12.83-7.15 2.25L6.67 13.5C8.22 12.55 10.05 12 12 12s3.78.55 5.33 1.5l1.82-2.25C17.12 9.83 14.67 9 12 9zm0 6c-1.33 0-2.53.38-3.55 1.03l3.55 4.47 3.55-4.47C14.53 15.38 13.33 15 12 15z"/></svg>
                <div className="w-5 h-2.5 border border-white rounded-[3.5px] p-[1px] flex items-center">
                  <div className="w-full h-full bg-white rounded-[1.5px]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-6">
              <svg className="w-8 h-8 fill-white mb-6" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              <p className={`text-[15px] font-normal mb-5 ${isError ? 'text-red-400 font-bold' : 'text-white/90'}`}>
                {isError ? '암호가 올바르지 않습니다' : '암호 입력'}
              </p>
              <div className={`flex gap-3.5 ${isError ? 'animate-bounce' : ''}`}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className={`w-3 h-3 rounded-full border border-white/80 transition-all ${passcode.length > index ? 'bg-white' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>

            <div className="w-full max-w-[280px] mx-auto grid grid-cols-3 gap-x-5 gap-y-3.5 my-auto">
              {KEYPAD_DATA.map((item) => (
                <button key={item.num} onClick={() => handleNumClick(item.num)} className="w-[72px] h-[72px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex flex-col items-center justify-center mx-auto backdrop-blur-md transition-transform active:scale-95">
                  <span className="text-2xl font-normal leading-none">{item.num}</span>
                  {item.sub && <span className="text-[9px] font-semibold tracking-widest text-white/80 mt-1 leading-none">{item.sub}</span>}
                </button>
              ))}
              <div />
              <button onClick={() => handleNumClick('0')} className="w-[72px] h-[72px] rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center mx-auto backdrop-blur-md text-2xl font-normal active:scale-95">0</button>
              <div />
            </div>

            <div className="flex justify-between items-center px-4 mb-2 text-xs font-normal text-white/90">
              <button className="hover:text-white">긴급상황</button>
              <button onClick={passcode.length > 0 ? handleDelete : handleCancel} className="hover:text-white">
                {passcode.length > 0 ? '지우기' : '취소'}
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center -mt-2">암호: 123456</p>
          </div>
        )}

        {/* --- 📞 수신 전화 화면 --- */}
        {currentApp === 'call_incoming' && (
          <div className="absolute inset-0 bg-zinc-950 backdrop-blur-3xl flex flex-col justify-between pt-20 pb-16 px-8 z-40 text-white">
            <div className="flex flex-col items-center mt-12">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">강아❤️</h2>
              <p className="text-sm text-zinc-400 font-medium">전화 걸려오는 중...</p>
            </div>

            <div className="flex justify-between items-center px-6 mb-8">
              <div className="flex flex-col items-center gap-2">
                <button onClick={handleRejectCall} className="w-18 h-18 bg-red-600 rounded-full flex items-center justify-center text-3xl shadow-xl active:scale-90 transition-transform cursor-pointer">📞</button>
                <span className="text-xs text-zinc-300 font-medium mt-1">거절</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button onClick={handleAcceptCall} className="w-18 h-18 bg-green-500 rounded-full flex items-center justify-center text-3xl shadow-xl active:scale-90 transition-transform cursor-pointer">📞</button>
                <span className="text-xs text-zinc-300 font-medium mt-1">응답</span>
              </div>
            </div>
          </div>
        )}

        {/* --- 🗣️ 강아❤️와 통화 중 화면 --- */}
        {currentApp === 'call_active' && (
          <div className="absolute inset-0 bg-zinc-950 flex flex-col justify-between pt-12 pb-10 px-6 z-40 text-white">
            <div className="flex flex-col items-center mt-4">
              <h2 className="text-xl font-bold tracking-tight">강아❤️</h2>
              <p className="text-xs text-green-400 mt-1 font-mono">{formatTime(callTimer)}</p>
            </div>

            <div className="my-auto bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-amber-400">🗣️ 강아❤️ 음성</span>
                <span className="text-[10px] text-zinc-500">실시간 자막</span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed min-h-[48px] flex items-center animate-pulse">
                &quot;{DOUN_SUBTITLES[subtitleIndex]}&quot;
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-4">
              <button onClick={handleEndCall} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform cursor-pointer">📞</button>
              <span className="text-xs text-zinc-400">통화 종료</span>
            </div>
          </div>
        )}

        {/* --- 📱 [2] 홈 화면 --- */}
        {currentApp === 'home' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EAA832] via-[#009688] to-[#007AFF] flex flex-col justify-between pt-2 pb-10 px-3.5 overflow-hidden z-0">
            <div className="flex justify-between items-center text-[13px] font-bold text-white px-4.5 pt-1 z-10">
              <span>10:07</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[1.5px] h-3">
                  <div className="w-[2.5px] h-[30%] bg-white rounded-full" />
                  <div className="w-[2.5px] h-[55%] bg-white rounded-full" />
                  <div className="w-[2.5px] h-[80%] bg-white rounded-full" />
                  <div className="w-[2.5px] h-[100%] bg-white rounded-full" />
                </div>
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 3C7.95 3 4.21 4.34 1.2 6.6L3 9c2.45-1.84 5.5-3 9-3s6.55 1.16 9 3l1.8-2.4C19.79 4.34 16.05 3 12 3zm0 6c-2.67 0-5.12.83-7.15 2.25L6.67 13.5C8.22 12.55 10.05 12 12 12s3.78.55 5.33 1.5l1.82-2.25C17.12 9.83 14.67 9 12 9zm0 6c-1.33 0-2.53.38-3.55 1.03l3.55 4.47 3.55-4.47C14.53 15.38 13.33 15 12 15z"/></svg>
                <div className="w-5 h-2.5 border border-white rounded-[3.5px] p-[1px] flex items-center">
                  <div className="w-full h-full bg-white rounded-[1.5px]" />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-start pt-6 pb-2 overflow-y-auto z-10">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-b from-[#3270A9] to-[#1E4B7A] rounded-[22px] p-3 text-white shadow-lg flex flex-col justify-between h-[132px] border border-white/10">
                  <div>
                    <p className="text-[11px] font-bold tracking-tight">서울</p>
                    <p className="text-3xl font-light tracking-tight mt-0.5">7°</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold">☀️ 대체로 맑음</p>
                    <p className="text-[9px] text-blue-200">최고:7° 최저:-3°</p>
                  </div>
                </div>

                <div className="bg-white rounded-[22px] p-3 text-black shadow-lg flex flex-col justify-between h-[132px]">
                  <div>
                    <p className="text-[11px] font-bold text-[#FF3B30]">일요일</p>
                    <p className="text-3xl font-bold tracking-tight text-zinc-900 mt-0.5">28일</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold">오늘 이벤트 없음</p>
                </div>
              </div>

              {/* 홈 그리드 앱 아이콘 */}
              <div className="grid grid-cols-4 gap-y-3.5 gap-x-2 text-center text-white text-[10px] font-medium mb-auto">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-white border border-white/20"><img src="/icons/calendar.png" alt="캘린더" className="w-full h-full object-cover" /></div>
                  <span className="drop-shadow">캘린더</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/camera.png" alt="카메라" className="w-full h-full object-cover" /></div>
                  <span className="drop-shadow">카메라</span>
                </div>
                <div onClick={() => setCurrentApp('gallery')} className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/photos.png" alt="사진" className="w-full h-full object-cover" /></div>
                  <span className="drop-shadow">사진</span>
                </div>
                <div onClick={() => { setCurrentApp('note'); setSelectedNote(null); }} className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/notes.png" alt="메모" className="w-full h-full object-cover" /></div>
                  <span className="drop-shadow">메모</span>
                </div>

                <div onClick={() => { setCurrentApp('instagram'); setShowDowoonStory(false); setInstagramTab('home'); }} className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform relative">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20 relative"><img src="/icons/instagram.png" alt="Instagram" className="w-full h-full object-cover" /></div>
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">1</span>
                  <span className="drop-shadow">Instagram</span>
                </div>

                <div onClick={() => { setCurrentApp('youtube'); setShowYoutubeComments(false); }} className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform relative">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20 relative"><img src="/icons/youtube.png" alt="YouTube" className="w-full h-full object-cover" /></div>
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">3</span>
                  <span className="drop-shadow">YouTube</span>
                </div>

                <div onClick={() => { setCurrentApp('x'); setTwitterTab('home'); setSelectedTrend(null); }} className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform relative">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20 relative"><img src="/icons/x.png" alt="X" className="w-full h-full object-cover" /></div>
                  <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">2</span>
                  <span className="drop-shadow">X</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden shadow-md flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/watch.png" alt="시계" className="w-full h-full object-cover" /></div>
                  <span className="drop-shadow">시계</span>
                </div>
              </div>

              {/* 하단 독(Dock) 영역 */}
              <div className="mt-auto pt-2">
                <div className="bg-white/20 backdrop-blur-2xl rounded-[28px] p-2 px-3 flex justify-around border border-white/20 shadow-xl items-center">
                  <div onClick={() => setCurrentApp('call')} className="relative cursor-pointer active:scale-90 transition-transform">
                    <div className="w-[48px] h-[48px] rounded-[13px] overflow-hidden shadow flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/call.png" alt="전화" className="w-full h-full object-cover" /></div>
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[20px] h-4 px-1 flex items-center justify-center shadow-md z-30 border border-white/20">{missedCallCount}</span>
                  </div>

                  <div className="relative">
                    <div className="w-[48px] h-[48px] rounded-[13px] overflow-hidden shadow flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/safari.png" alt="Safari" className="w-full h-full object-cover" /></div>
                  </div>

                  <div onClick={() => { setCurrentApp('message'); setSelectedMessageThreadId(null); }} className="relative cursor-pointer active:scale-90 transition-transform">
                    <div className="w-[48px] h-[48px] rounded-[13px] overflow-hidden shadow flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/messege.png" alt="메시지" className="w-full h-full object-cover" /></div>
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md z-30 border border-white/20">1</span>
                  </div>

                  <div onClick={() => { setCurrentApp('kakaotalk'); setKakaoTab('chats'); setSelectedKakaoChatId(null); }} className="relative cursor-pointer active:scale-90 transition-transform">
                    <div className="w-[48px] h-[48px] rounded-[13px] overflow-hidden shadow flex items-center justify-center bg-black/10 border border-white/20"><img src="/icons/kakaotalk.png" alt="카카오톡" className="w-full h-full object-cover" /></div>
                    {kakaoThreads.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0) > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[8px] font-bold rounded-full min-w-[22px] h-4 px-1 flex items-center justify-center shadow-md z-30 border border-white/20">
                        {kakaoThreads.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 📞 [전화 앱] --- */}
        {currentApp === 'call' && (
          <div className="absolute inset-0 bg-black text-white pt-9 pb-14 overflow-hidden z-30 flex flex-col justify-between font-sans">
            <div className="px-4 pt-2 pb-2 bg-black border-b border-zinc-900">
              <div className="flex justify-between items-center mb-2">
                <button onClick={() => setCurrentApp('home')} className="text-[#007AFF] text-xs font-semibold flex items-center gap-0.5">
                  ‹ 홈
                </button>
                {phoneTab === 'recents' && (
                  <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-zinc-700/50">
                    <button onClick={() => setCallFilter('all')} className={`px-3 py-0.5 rounded-md text-[11px] font-semibold transition-all ${callFilter === 'all' ? 'bg-zinc-600 text-white' : 'text-zinc-400'}`}>
                      전체
                    </button>
                    <button onClick={() => setCallFilter('missed')} className={`px-3 py-0.5 rounded-md text-[11px] font-semibold transition-all ${callFilter === 'missed' ? 'bg-zinc-600 text-white' : 'text-zinc-400'}`}>
                      부재중
                    </button>
                  </div>
                )}
                <button className="text-[#007AFF] text-xs font-semibold">편집</button>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                {phoneTab === 'recents' ? '최근 통화' : phoneTab === 'contacts' ? '연락처' : phoneTab === 'favorites' ? '즐겨찾기' : '키패드'}
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {phoneTab === 'recents' && (
                <div className="divide-y divide-zinc-900">
                  {CALL_HISTORY.filter(item => callFilter === 'all' || item.isMissed).map((item) => (
                    <div key={item.id} className="px-4 py-3 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm">
                          {item.isMissed ? <span className="text-red-500 font-bold">↙</span> : <span className="text-zinc-500">↗</span>}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-semibold ${item.isMissed ? 'text-red-500' : 'text-white'}`}>
                              {item.name}
                            </span>
                            {item.count && item.count > 1 && (
                              <span className="text-xs text-zinc-400 font-normal">({item.count})</span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{item.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-zinc-500">{item.time}</span>
                        <button className="w-5 h-5 rounded-full border border-[#007AFF] text-[#007AFF] flex items-center justify-center text-[10px] font-serif italic">i</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {phoneTab === 'contacts' && (
                <div className="p-2 space-y-1">
                  <div className="bg-zinc-900 rounded-xl px-3 py-1.5 flex items-center gap-2 text-zinc-400 text-xs mb-3">
                    <span>🔍</span>
                    <span>검색</span>
                  </div>
                  <div className="divide-y divide-zinc-900">
                    {CONTACTS_DATA.map((c) => (
                      <div key={c.id} className="py-2.5 px-3 flex justify-between items-center hover:bg-zinc-900/60 rounded-lg">
                        <span className="text-sm font-semibold text-white">{c.name}</span>
                        <span className="text-xs text-zinc-400">{c.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phoneTab === 'favorites' && (
                <div className="p-3 space-y-2">
                  <p className="text-xs font-semibold text-zinc-400 px-1 mb-2">즐겨찾는 연락처</p>
                  <div className="divide-y divide-zinc-900 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 overflow-hidden">
                    {CONTACTS_DATA.filter(c => c.isFavorite).map((c) => (
                      <div key={c.id} className="p-3.5 flex justify-between items-center hover:bg-zinc-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-zinc-700">
                            {c.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{c.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{c.phone}</p>
                          </div>
                        </div>
                        <span className="text-sm text-[#007AFF]">📞</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phoneTab === 'keypad' && (
                <div className="flex flex-col items-center justify-end h-full pt-16 pb-4">
                  <div className="text-3xl font-light text-white tracking-widest mb-8 min-h-[40px] flex items-center">
                    {dialedNumber || <span className="text-zinc-600 text-sm tracking-normal">번호를 입력하세요</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-3.5 mb-6">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                      <button key={digit} onClick={() => setDialedNumber(prev => prev + digit)} className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-700 active:bg-zinc-600 flex flex-col items-center justify-center text-2xl font-normal transition-transform active:scale-95">
                        {digit}
                      </button>
                    ))}
                  </div>
                  <div className="h-16 flex items-center justify-center">
                    {dialedNumber ? (
                      <button onClick={() => setCurrentApp('call_active')} className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform">📞</button>
                    ) : (
                      <div className="w-16 h-16" />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 flex justify-around items-center py-2 text-[10px] text-zinc-500 z-20">
              <button onClick={() => setPhoneTab('favorites')} className={`flex flex-col items-center gap-0.5 ${phoneTab === 'favorites' ? 'text-[#007AFF] font-bold' : ''}`}>
                <span className="text-base">⭐</span>
                <span>즐겨찾기</span>
              </button>
              <button onClick={() => setPhoneTab('recents')} className={`flex flex-col items-center gap-0.5 ${phoneTab === 'recents' ? 'text-[#007AFF] font-bold' : ''}`}>
                <span className="text-base">🕒</span>
                <span>최근 통화</span>
              </button>
              <button onClick={() => setPhoneTab('contacts')} className={`flex flex-col items-center gap-0.5 ${phoneTab === 'contacts' ? 'text-[#007AFF] font-bold' : ''}`}>
                <span className="text-base">👤</span>
                <span>연락처</span>
              </button>
              <button onClick={() => setPhoneTab('keypad')} className={`flex flex-col items-center gap-0.5 ${phoneTab === 'keypad' ? 'text-[#007AFF] font-bold' : ''}`}>
                <span className="text-base">⌨️</span>
                <span>키패드</span>
              </button>
            </div>
          </div>
        )}

        {/* --- 💬 메시지 앱 뷰 --- */}
        {currentApp === 'message' && (
          <div className="absolute inset-0 bg-black text-white pt-10 pb-12 px-3 overflow-hidden z-30 flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-2">
              {selectedMessageThreadId ? (
                <button onClick={() => setSelectedMessageThreadId(null)} className="text-[#007AFF] text-xs font-semibold flex items-center gap-0.5">‹ 메시지</button>
              ) : (
                <button onClick={() => setCurrentApp('home')} className="text-[#007AFF] text-xs font-semibold">‹ 아이폰 홈</button>
              )}
              <span className="text-xs font-bold truncate max-w-[150px]">{selectedMessageThreadId ? activeThread?.name : '메시지'}</span>
              <button className="text-[#007AFF] text-xs font-semibold">{selectedMessageThreadId ? 'ⓘ' : '편집'}</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {!selectedMessageThreadId && (
                <div className="divide-y divide-zinc-900 space-y-1">
                  <h2 className="text-xl font-bold px-1 py-1">대화 목록</h2>
                  {MESSAGE_THREADS.map((thread) => (
                    <div key={thread.id} onClick={() => setSelectedMessageThreadId(thread.id)} className="py-3 px-1 hover:bg-zinc-900/80 active:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-3 pr-2 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-sm font-bold border border-zinc-700">{thread.name[0]}</div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate">{thread.name}</span>
                            {thread.unreadCount && <span className="w-2 h-2 rounded-full bg-[#007AFF] inline-block" />}
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate mt-0.5">{thread.preview}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-[10px] text-zinc-500">{thread.time}</span>
                        <span className="text-zinc-600 text-xs font-bold mt-1">›</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedMessageThreadId && activeThread && (
                <div className="space-y-3 text-[12px] px-1 py-2">
                  {activeThread.messages.map((msg) => (
                    <React.Fragment key={msg.id}>
                      {msg.dateDivider && <div className="text-center text-[10px] text-zinc-500 my-3 font-medium">{msg.dateDivider}</div>}
                      <div className={`p-2.5 rounded-2xl max-w-[82%] leading-relaxed ${msg.sender === 'me' ? 'bg-[#007AFF] text-white ml-auto rounded-br-sm' : 'bg-[#26252A] text-zinc-100 mr-auto rounded-bl-sm border border-zinc-800'}`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 💬 카카오톡 앱 뷰 --- */}
        {currentApp === 'kakaotalk' && (
          <div className="absolute inset-0 bg-white text-black pt-9 pb-12 overflow-hidden z-30 flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 bg-white z-10">
              <button 
                onClick={() => setCurrentApp('home')} 
                className="text-[#333] text-xs font-semibold hover:text-black flex items-center gap-0.5 bg-zinc-100 px-2 py-1 rounded-md"
              >
                ‹ 홈
              </button>
              <span className="text-base font-extrabold text-black">
                {kakaoTab === 'friends' ? '친구' : kakaoTab === 'chats' ? '채팅' : kakaoTab === 'openchat' ? '오픈채팅' : kakaoTab === 'shopping' ? '쇼핑' : '더보기'}
              </span>
              <div className="flex items-center gap-2 text-base">
                <span>🔍</span>
                <span>💬</span>
                <span>⚙️</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white relative no-scrollbar">
              {/* 1. 친구 탭 */}
              {kakaoTab === 'friends' && (
                <div className="p-3 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-white flex items-center justify-center font-bold text-lg shadow">박</div>
                    <div>
                      <p className="font-bold text-sm text-black">박성진</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">상태메시지를 입력해 주세요.</p>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-zinc-400 px-1">친구 ({CONTACTS_DATA.length})</p>

                  <div className="space-y-1">
                    {CONTACTS_DATA.map((contact) => (
                      <div key={contact.id} onClick={() => setSelectedProfileContact(contact)} className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">{contact.name[0]}</div>
                          <div>
                            <p className="text-xs font-bold text-black">{contact.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. 채팅 탭 및 개별 대화방 */}
              {kakaoTab === 'chats' && (
                <div>
                  {selectedKakaoChatId && activeKakaoThread ? (
                    <div className="absolute inset-0 bg-[#B2C7D9] z-20 flex flex-col">
                      <div className="flex items-center justify-between px-3 py-2 bg-[#B2C7D9] border-b border-black/5">
                        <button onClick={() => setSelectedKakaoChatId(null)} className="text-sm font-bold text-black flex items-center gap-0.5">‹ 뒤로</button>
                        <span className="text-xs font-bold text-black truncate max-w-[160px]">{activeKakaoThread.name}</span>
                        <span className="text-sm text-black">≡</span>
                      </div>
                      
                      {/* 📌 카톡 메시지와 프로필이 분리된 대화창 */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        <div className="text-center text-[10px] text-zinc-600 bg-white/40 py-1 px-3 rounded-full mx-auto w-fit mb-2">
                          ↑ 위로 스크롤하여 이전 과거 대화 내용 확인
                        </div>
                        {activeKakaoThread.messages.map((msg) => {
                          const senderDisplayName = msg.senderName || activeKakaoThread.name;
                          return (
                            <React.Fragment key={msg.id}>
                              {msg.dateDivider && (
                                <div className="text-center text-[10px] text-white/90 bg-black/10 py-1 px-3 rounded-full mx-auto w-fit my-2">
                                  {msg.dateDivider}
                                </div>
                              )}
                              {msg.sender === 'me' ? (
                                <div className="flex justify-end">
                                  <div className="p-2.5 rounded-xl max-w-[75%] text-xs leading-relaxed bg-[#FEE500] text-black rounded-tl-xl rounded-bl-xl rounded-br-sm shadow-sm">
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2 max-w-[85%]">
                                  <div className="w-9 h-9 rounded-2xl bg-amber-400 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-sm mt-0.5">
                                    {senderDisplayName[0]}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[11px] font-semibold text-zinc-700 mb-1 pl-0.5">{senderDisplayName}</span>
                                    <div className="p-2.5 rounded-xl text-xs leading-relaxed bg-white text-black rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-sm">
                                      <p className="whitespace-pre-line">{msg.text}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <div className="p-2 bg-white flex items-center gap-2">
                        <span className="text-lg">➕</span>
                        <div className="flex-1 bg-zinc-100 rounded-full px-3 py-1.5 text-xs text-zinc-400">메시지 보내기...</div>
                        <span className="text-lg text-amber-400">😊</span>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 pb-16">
                      {kakaoThreads.map((thread) => (
                        <div key={thread.id} onClick={() => handleSelectKakaoChat(thread.id)} className="p-3 hover:bg-zinc-50 flex items-center justify-between cursor-pointer transition-colors">
                          <div className="flex items-center gap-3 pr-2 overflow-hidden">
                            <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${thread.id.startsWith('k_ad') ? 'bg-zinc-800 text-white' : 'bg-amber-400 text-white'}`}>
                              {thread.name[0]}
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-black truncate">{thread.name}</span>
                                {thread.unreadCount && thread.unreadCount > 0 ? (
                                  <span className="bg-[#FA5151] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                                    {thread.unreadCount}
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-[11px] text-zinc-500 truncate mt-0.5">{thread.preview}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-400 flex-shrink-0">{thread.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. 오픈채팅 탭 */}
              {kakaoTab === 'openchat' && (
                <div className="p-4 space-y-3 text-center">
                  <p className="text-xs font-bold text-black">🔥 인기 오픈채팅방</p>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-left">
                    <p className="text-xs font-bold text-zinc-800">DAY6 음악 소통방 🎸</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">참여인원 1,500명 • 방금 전 활성화</p>
                  </div>
                </div>
              )}

              {/* 4. 쇼핑 탭 */}
              {kakaoTab === 'shopping' && (
                <div className="p-4 space-y-3">
                  <p className="text-xs font-bold text-black">🛍️ 카카오 쇼핑 랭킹</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                      <p className="font-bold">🎁 선물하기</p>
                      <p className="text-[10px] text-zinc-400 mt-1">인기 소금빵 세트</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-center">
                      <p className="font-bold">⚡ 타임딜</p>
                      <p className="text-[10px] text-zinc-400 mt-1">블루투스 헤드셋</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. 더보기 탭 */}
              {kakaoTab === 'more' && (
                <div className="p-4 space-y-3 text-xs text-zinc-700">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <span className="font-bold text-black text-sm">박성진님</span>
                    <span className="text-zinc-400">pay 12,500원 ›</span>
                  </div>
                  <p>공지사항</p>
                  <p>실험실</p>
                  <p>개인/보안</p>
                </div>
              )}
            </div>

            {/* 프로필 레이어 (1:1 채팅 진입 클릭 비활성화 적용) */}
            {selectedProfileContact && (
              <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-xs">
                <div className="bg-zinc-800 text-white rounded-t-[30px] p-6 pb-12 flex flex-col items-center relative shadow-2xl">
                  <button onClick={() => setSelectedProfileContact(null)} className="absolute top-4 right-5 text-zinc-400 hover:text-white text-lg font-bold">✕</button>
                  <div className="w-20 h-20 rounded-3xl bg-amber-400 text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-3">{selectedProfileContact.name[0]}</div>
                  <h3 className="text-lg font-bold text-white mb-6">{selectedProfileContact.name}</h3>

                  <div className="flex items-center gap-8 w-full justify-center pt-4 border-t border-zinc-700/80">
                    {/* 📌 1:1 채팅 버튼 클릭 및 대화방 이동 제거 */}
                    <div className="flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed">
                      <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center text-lg shadow">💬</div>
                      <span className="text-[11px] text-zinc-400 font-medium">1:1 채팅</span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed">
                      <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center text-lg shadow">📞</div>
                      <span className="text-[11px] text-zinc-400 font-medium">통화하기</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 카카오톡 하단 배너 */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#F9F9F9] border-t border-zinc-200 flex justify-around items-center py-2 text-[10px] text-zinc-500 z-20">
              <button onClick={() => setKakaoTab('friends')} className={`flex flex-col items-center gap-0.5 ${kakaoTab === 'friends' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                <span className="text-base">👤</span>
                <span>친구</span>
              </button>
              <button onClick={() => setKakaoTab('chats')} className={`flex flex-col items-center gap-0.5 ${kakaoTab === 'chats' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                <span className="text-base">💬</span>
                <span>채팅</span>
              </button>
              <button onClick={() => setKakaoTab('openchat')} className={`flex flex-col items-center gap-0.5 ${kakaoTab === 'openchat' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                <span className="text-base">👀</span>
                <span>오픈채팅</span>
              </button>
              <button onClick={() => setKakaoTab('shopping')} className={`flex flex-col items-center gap-0.5 ${kakaoTab === 'shopping' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                <span className="text-base">🛍️</span>
                <span>쇼핑</span>
              </button>
              <button onClick={() => setKakaoTab('more')} className={`flex flex-col items-center gap-0.5 ${kakaoTab === 'more' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                <span className="text-base">⋯</span>
                <span>더보기</span>
              </button>
            </div>
          </div>
        )}

        {/* --- [4] 메모장 앱 뷰 --- */}
        {currentApp === 'note' && (
          <div className="absolute inset-0 bg-black text-white pt-10 pb-12 px-4 overflow-hidden z-30 flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              {selectedNote ? (
                <button onClick={() => setSelectedNote(null)} className="text-[#FF9500] text-xs font-semibold flex items-center gap-1">‹ 메모 목록</button>
              ) : (
                <button onClick={() => setCurrentApp('home')} className="text-[#FF9500] text-xs font-semibold">‹ 홈</button>
              )}
              <span className="text-[#FF9500] text-xs font-semibold">{selectedNote ? '편집' : '완료'}</span>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 space-y-2">
              {selectedNote ? (
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-xl">{selectedNote.content}</div>
              ) : (
                <div className="space-y-3">
                  <h1 className="text-xl font-bold text-white mb-3 px-1">메모</h1>
                  {NOTES_DATA.map((note) => (
                    <div key={note.id} onClick={() => setSelectedNote(note)} className="bg-zinc-900/70 hover:bg-zinc-800/90 active:scale-[0.98] transition-all border border-zinc-800 rounded-xl p-3.5 cursor-pointer flex justify-between items-center">
                      <div className="pr-2">
                        <p className={`font-bold text-xs ${note.id === '1' || note.id === '2' ? 'text-amber-400' : 'text-zinc-100'}`}>{note.title}</p>
                        <p className="text-[10px] text-zinc-500 mt-1">{note.date} • <span className="text-zinc-400">{note.category}</span></p>
                      </div>
                      <span className="text-zinc-600 text-sm font-bold">›</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- [5] 사진 앱 뷰 --- */}
        {currentApp === 'gallery' && (
          <div className="absolute inset-0 bg-black text-white pt-10 pb-12 px-3 overflow-hidden z-30 flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-2">
              <button onClick={() => setCurrentApp('home')} className="text-[#007AFF] text-xs font-semibold">‹ 홈</button>
              <span className="text-xs font-bold">보관함</span>
              <div className="w-10" />
            </div>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-1 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <div key={item} className="aspect-square bg-zinc-800 rounded-md flex items-center justify-center text-[10px] text-zinc-500">
                  {item === 1 ? '📸 커플사진' : item === 9 ? '⚠️ 멍든 사진' : `사진 ${item}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- [6] 인스타그램 앱 뷰 --- */}
        {currentApp === 'instagram' && (
          <div className="absolute inset-0 bg-black text-white pt-9 pb-12 overflow-hidden z-30 flex flex-col justify-between">
            {showDowoonStory && (
              <div className="absolute inset-0 bg-black z-50 flex flex-col justify-between p-4 pt-10 text-white animate-fade-in">
                <div>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-3">
                    <div className="w-full h-full bg-white rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm font-bold border border-white/20">🐶</div>
                      <div>
                        <p className="text-xs font-bold">ddowoon</p>
                        <p className="text-[10px] text-zinc-400">10분 전</p>
                      </div>
                    </div>
                    <button onClick={() => setShowDowoonStory(false)} className="text-zinc-400 hover:text-white text-lg font-bold px-2">✕</button>
                  </div>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-sm font-medium leading-relaxed text-zinc-100 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl shadow-2xl">
                    &quot;저도 방금 유튜브 보고 알았습니다...<br />지금 형이랑 연락이 전혀 안 돼서 저도 상황을 모르겠어요.&quot;
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs text-zinc-500">ddowoon님에게 메시지 보내기...</div>
                  <span className="text-lg">❤️</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between px-3.5 pb-2 border-b border-zinc-900 bg-black z-10">
              <button onClick={() => setCurrentApp('home')} className="text-xs text-zinc-400 font-semibold">‹ 홈</button>
              <span className="text-sm font-bold tracking-tight">Instagram</span>
              <div className="flex items-center gap-3 text-sm"><span>❤️</span><span>💬</span></div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {instagramTab === 'home' && (
                <div>
                  <div className="flex gap-3 px-3 py-3 overflow-x-auto border-b border-zinc-900 no-scrollbar">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-zinc-800 p-0.5 border border-zinc-700 flex items-center justify-center text-xs">내스토리</div>
                      <span className="text-[10px] text-zinc-400">내 스토리</span>
                    </div>

                    <div onClick={() => setShowDowoonStory(true)} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full bg-black rounded-full p-0.5 flex items-center justify-center">
                          <div className="w-full h-full bg-amber-400 rounded-full flex items-center justify-center text-lg font-bold">🐶</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-white">ddowoon</span>
                    </div>

                    {['wonpil_d', 'youngk_93', 'day6_cnt'].map((user, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0 opacity-70">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 p-[2px]">
                          <div className="w-full h-full bg-black rounded-full p-0.5 flex items-center justify-center">
                            <div className="w-full h-full bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-white">{user[0]}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-400 truncate max-w-[50px]">{user}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 py-2">
                    {INSTAGRAM_FEEDS.map((feed) => (
                      <div key={feed.id} className="border-b border-zinc-900 pb-3">
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold">{feed.author[0]}</div>
                            <div>
                              <p className="text-xs font-bold text-white">{feed.author}</p>
                              <p className="text-[9px] text-zinc-400">{feed.location}</p>
                            </div>
                          </div>
                          <span>⋯</span>
                        </div>
                        <div className="aspect-square bg-zinc-900 flex items-center justify-center text-xs text-zinc-500">📸 인스타그램 피드 이미지</div>
                        <div className="px-3 pt-2 space-y-1 text-xs">
                          <div className="flex gap-3 text-lg"><span>❤️</span><span>💬</span><span>✈️</span></div>
                          <p className="font-bold text-[11px]">좋아요 {feed.likes}</p>
                          <p className="text-zinc-200 text-[11px]"><span className="font-bold mr-1">{feed.author}</span>{feed.content}</p>
                          <p className="text-[9px] text-zinc-500">{feed.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {instagramTab === 'search' && (
                <div className="p-3 grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="aspect-square bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-600">탐색 {i}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around items-center py-2.5 text-lg z-20">
              <button onClick={() => setInstagramTab('home')} className={instagramTab === 'home' ? 'text-white font-bold' : 'text-zinc-500'}>🏠</button>
              <button onClick={() => setInstagramTab('search')} className={instagramTab === 'search' ? 'text-white font-bold' : 'text-zinc-500'}>🔍</button>
              <button className="text-zinc-500">➕</button>
              <button className="text-zinc-500">🎬</button>
              <button className="text-zinc-500">👤</button>
            </div>
          </div>
        )}

        {/* --- [7] 유튜브 앱 뷰 --- */}
        {currentApp === 'youtube' && (
          <div className="absolute inset-0 bg-black text-white pt-9 pb-10 px-3 overflow-hidden z-30 flex flex-col relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
              <button onClick={() => setCurrentApp('home')} className="text-white text-xs font-semibold">‹ 홈</button>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                <span className="text-xs font-bold tracking-tight">YouTube</span>
              </div>
              <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pt-1">
              <div className="bg-zinc-900 rounded-xl p-2.5 border border-zinc-800">
                <div className="aspect-video bg-black rounded-lg flex flex-col items-center justify-center text-xs text-zinc-500 mb-2 border border-zinc-800 relative">
                  <span className="text-2xl mb-1">▶</span>
                  <span>0:00 / 3:12</span>
                </div>
                <p className="text-sm font-bold text-white">헤어졌습니다</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800">
                  <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold">🐻</div>
                  <div>
                    <p className="text-xs font-bold text-zinc-100">곰개🐻🐶</p>
                    <p className="text-[10px] text-zinc-400">구독자 42.8만명 • 조회수 84만회 • 1시간 전</p>
                  </div>
                </div>
              </div>

              <div onClick={() => setShowYoutubeComments(true)} className="bg-zinc-900/90 hover:bg-zinc-800 transition-colors rounded-xl p-3 border border-zinc-800 cursor-pointer active:scale-[0.99]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">댓글</span>
                    <span className="text-xs text-zinc-400 font-semibold">4,829개</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-bold">전체보기 ›</span>
                </div>
                <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                  <p className="text-[11px] font-bold text-zinc-300">초코쿠키 <span className="text-[9px] text-zinc-500 font-normal">방금 전</span></p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 truncate">아니 도운님 스토리에 자기도 몰랐다고 올라왔는데...</p>
                </div>
              </div>
            </div>

            {showYoutubeComments && (
              <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col pt-10 pb-12 px-3 animate-fade-in">
                <div className="flex justify-between items-center pb-2.5 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">댓글</h3>
                    <span className="text-xs text-zinc-400 font-medium">4,829</span>
                  </div>
                  <button onClick={() => setShowYoutubeComments(false)} className="text-zinc-400 hover:text-white text-base font-bold px-2">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3.5 py-3 pr-1">
                  {YOUTUBE_COMMENTS.map((comment) => (
                    <div key={comment.id} className="border-b border-zinc-900 pb-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-200">{comment.user}</span>
                        <span className="text-[10px] text-zinc-500">{comment.time}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">{comment.text}</p>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-zinc-500">
                        <span>👍 {comment.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- [8] X (트위터) 앱 뷰 --- */}
        {currentApp === 'x' && (
          <div className="absolute inset-0 bg-black text-white pt-9 pb-12 overflow-hidden z-30 flex flex-col justify-between">
            <div className="flex items-center justify-between px-3.5 pb-2 border-b border-zinc-800 bg-black z-10">
              <button onClick={() => setCurrentApp('home')} className="text-xs text-zinc-400 font-semibold">‹ 홈</button>
              <div className="flex gap-4 text-xs font-bold">
                {twitterTab === 'home' && (
                  <>
                    <span className="text-white border-b-2 border-sky-500 pb-0.5">추천</span>
                    <span className="text-zinc-500">팔로잉</span>
                  </>
                )}
                {twitterTab === 'search' && <span className="text-sky-400 font-bold">🔍 실시간 트렌드</span>}
                {twitterTab === 'notification' && <span className="text-sky-400 font-bold">🔔 알림 및 멘션</span>}
                {twitterTab === 'dm' && <span className="text-sky-400 font-bold">✉️ 쪽지 (DM)</span>}
              </div>
              <span className="text-sm">✨</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {twitterTab === 'home' && (
                <div className="divide-y divide-zinc-800">
                  {TWEETS_DATA.map((tweet) => (
                    <div key={tweet.id} className="p-3 hover:bg-zinc-900/50 transition-colors space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-white">{tweet.author[0]}</div>
                          <span className="text-xs font-bold text-white">{tweet.author}</span>
                          <span className="text-[10px] text-zinc-500">{tweet.handle} • {tweet.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed pl-8.5">{tweet.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {twitterTab === 'search' && (
                <div className="p-3 space-y-3">
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 space-y-3">
                    <h3 className="text-sm font-bold text-white pb-2 border-b border-zinc-800">나를 위한 실시간 트렌드</h3>
                    <div className="space-y-3">
                      {TRENDS_LIST.map((trend) => (
                        <div key={trend.rank} onClick={() => setSelectedTrend(trend.keyword)} className="flex justify-between items-center cursor-pointer hover:bg-zinc-800/80 p-2 rounded-xl transition-all border border-zinc-800/50">
                          <div>
                            <p className="text-[10px] text-zinc-500 font-semibold">{trend.rank} • {trend.category}</p>
                            <p className="text-xs font-bold text-sky-400 mt-0.5">#{trend.keyword}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{trend.tweets}</p>
                          </div>
                          <span className="text-zinc-600 text-xs font-bold">›</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {twitterTab === 'notification' && (
                <div className="p-3 space-y-2 text-xs">
                  <p className="font-bold text-zinc-400 pb-1 border-b border-zinc-800">최근 알림</p>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                    <p className="text-zinc-300 font-bold">💬 @dowoon_love 님이 회원님의 트윗을 인용했습니다.</p>
                    <p className="text-[10px] text-zinc-500 mt-1">15분 전</p>
                  </div>
                </div>
              )}

              {twitterTab === 'dm' && (
                <div className="p-3 space-y-2 text-xs">
                  <p className="font-bold text-zinc-400 pb-1 border-b border-zinc-800">쪽지함</p>
                  <div className="text-center py-12 text-zinc-500">
                    <p className="text-sm font-bold text-zinc-400 mb-1">새로운 쪽지가 없습니다</p>
                    <p className="text-[11px]">대화를 시작해 보세요!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-black border-t border-zinc-800 flex justify-around items-center py-2.5 text-zinc-400 text-lg z-20">
              <button onClick={() => { setTwitterTab('home'); setSelectedTrend(null); }} className={`transition-transform active:scale-90 ${twitterTab === 'home' ? 'text-white font-bold scale-110' : 'text-zinc-500'}`}>🏠</button>
              <button onClick={() => { setTwitterTab('search'); setSelectedTrend(null); }} className={`transition-transform active:scale-90 ${twitterTab === 'search' ? 'text-white font-bold scale-110' : 'text-zinc-500'}`}>🔍</button>
              <button onClick={() => { setTwitterTab('notification'); setSelectedTrend(null); }} className={`transition-transform active:scale-90 ${twitterTab === 'notification' ? 'text-white font-bold scale-110' : 'text-zinc-500'}`}>🔔</button>
              <button onClick={() => { setTwitterTab('dm'); setSelectedTrend(null); }} className={`transition-transform active:scale-90 ${twitterTab === 'dm' ? 'text-white font-bold scale-110' : 'text-zinc-500'}`}>✉️</button>
            </div>
          </div>
        )}

        {/* 하단 홈 바 */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
          <button onClick={() => setCurrentApp('home')} className="w-36 h-1 bg-white/80 rounded-full hover:bg-white active:scale-95 transition-all cursor-pointer shadow" />
        </div>

      </div>
    </main>
  );
}
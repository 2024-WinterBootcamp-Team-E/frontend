import { create } from 'zustand';

export const useSampleStore = create((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	reset: () => set({ count: 0 }),
}));

export const useRecordStore = create((set) => ({
	recordedAudio: null, // 초기 상태: null
	setRecordedAudio: (audio) => set({ recordedAudio: audio }), // 오디오 설정
	clearRecordedAudio: () => set({ recordedAudio: null }), // 오디오 초기화
}));

export const useChatroomStore = create((set) => ({
	chatroomList: [],
	setChatroomList: (chatroomListData) => set({ chatroomList: chatroomListData }),
}));

export const useChatroomDataStore = create((set) => ({
	// 데이터 형식 :
	// {
  //     "chat_id": 0,
  //     "user_id": 0,
  //     "score": null,
  //     "title": "",
  //     "character_name": "미국",
  //     "tts_id": "mZ8K1MPRiT5wDQaasg3i",
  //     "created_at": "2024-12-19T07:56:39",
  //     "updated_at": "2024-12-20T07:56:39"
  //   }
	openedChatroomList: [], // 내가 그동안 열어본 채팅방 리스트
  currentChatroom: { // 현재 접속하고 있는 채팅방
      "chat_id": 0,
      "user_id": 0,
      "score": null,
      "title": "",
      "character_name": "미국",
      "tts_id": "mZ8K1MPRiT5wDQaasg3i",
      "created_at": "2024-12-19T07:56:39",
      "updated_at": "2024-12-20T07:56:39"
    }, // 현재 선택된 채팅방
  // 내가 그동안 열어본 채팅방 리스트 갱신
  setOpenedChatroomList: (newOpenedData) =>
    set((state) => ({
      openedChatroomList: [...state.openedChatroomList, newOpenedData],
    })),
  // 특정 chat_id를 가진 요소 찾기
  findChatroomById: (chatId) => {
		const state = useChatroomDataStore.getState();
		// 찾으면 채팅방 data, 못찾으면 undefined 반환
    return state.openedChatroomList.find((chatroom) => chatroom.chat_id === chatId); 
	},
	// 현재 선택된 채팅방 갱신
  setCurrentChatroom: (data) => {
    const chatroomData = findChatroomById(data.chat_id); // 해당 chatId로 채팅방 찾기
    if (chatroomData) {
      set({ currentChatroom: chatroom }); // 찾은 채팅방을 currentChatroom에 설정
    } else {
      console.warn(`Chatroom with chat_id: ${data.chat_id} not found`);
      set({ currentChatroom: data }); // 찾지 못하면 data로 설정
			setOpenedChatroomList(data) // openedChatroomList에 저장
    }
  },
}));
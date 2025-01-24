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
	openedChatroomList: [], // 초기 상태

  // 새로운 데이터 추가
  setOpenedChatroomList: (newOpenedData) =>
    set((state) => ({
      openedChatroomList: [...state.openedChatroomList, newOpenedData],
    })),

  // 특정 chat_id를 가진 요소 찾기
  findChatroomById: (chatId) => {
    const state = useChatroomDataStore.getState();
    return state.openedChatroomList.find((chatroom) => chatroom.chat_id === chatId);
  },
}));
import { create } from 'zustand';

export const useSampleStore = create((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	reset: () => set({ count: 0 }),
}));

export const useRecordStore = create((set) => ({
	recordedAudio: null,
	setRecordedAudio: (audio) => set({ recordedAudio: audio }),
	resetRecordedAudio: () => set({ recordedAudio: null }), // 초기화 메서드
	// 다른 상태와 메서드들...
}));

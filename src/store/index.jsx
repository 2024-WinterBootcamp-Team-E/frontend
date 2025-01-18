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
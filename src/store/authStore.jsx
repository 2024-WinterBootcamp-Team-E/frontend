import { create } from 'zustand';

const useAuthStore = create((set) => ({
	isLoggedIn: false,
	profile: null,
	setAuth: (loggedIn, profile) => set({ isLoggedIn: loggedIn, profile }),
	logout: () => set({ isLoggedIn: false, profile: null }),
}));

export default useAuthStore;

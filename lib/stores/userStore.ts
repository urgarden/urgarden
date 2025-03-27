import { create } from "zustand";

type UserDetails = {
  id: string;
  email: string;
  role: string;
};

type UserStore = {
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails) => void;
  clearUserDetails: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userDetails: null,
  setUserDetails: (details) => set({ userDetails: details }),
  clearUserDetails: () => set({ userDetails: null }),
}));

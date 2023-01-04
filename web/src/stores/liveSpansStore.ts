import create from "zustand";

interface LiveSpansState {
  isOn: boolean;
  intervalInMillis: number;
  setIsOn: (isOn: boolean) => void;
}

export const useLiveSpansStore = create<LiveSpansState>()((set) => ({
  isOn: false,
  intervalInMillis: 2000,
  setIsOn: (isOn: boolean) => set({ isOn: isOn }),
}));

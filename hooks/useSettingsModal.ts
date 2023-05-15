import { create } from "zustand";

interface SettingsModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useSettingsModal = create<SettingsModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useSettingsModal;

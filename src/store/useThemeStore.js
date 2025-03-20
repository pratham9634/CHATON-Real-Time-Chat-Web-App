import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "black", // Default theme

  setTheme: () => {
    set((state) => ({ theme: state.theme === "black" ? "light" : "black" }));
  },
}));

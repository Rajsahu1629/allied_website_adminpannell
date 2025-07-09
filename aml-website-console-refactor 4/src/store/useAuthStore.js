import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: !!localStorage.getItem("token"),

  login: ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, isLoggedIn: false });
  },
}));

export default useAuthStore;

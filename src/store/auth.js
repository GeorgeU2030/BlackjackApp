import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
      user: null,
      token: localStorage.getItem('token') || null,
  }),
  getters: {
      isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(userData, token) {
        this.user = userData;
        this.token = token;
        localStorage.setItem('token', token);
  },
  logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
      }
  }
})